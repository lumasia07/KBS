<?php

namespace App\Http\Controllers\Taxpayer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\StoreRequest;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\StampOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $userRoles = $user->roles()->pluck('name')->toArray();

        // Check if user has administrator roles
        $isAdmin = !empty(array_intersect(
            ['Super Administrator', 'System Administrator'],
            $userRoles
        ));

        // Build base query
        $query = Payment::with(['order', 'paymentMethod'])->latest();

        // Apply taxpayer filter for non-admin users
        if (!$isAdmin) {
            $query->where('taxpayer_id', $user->taxpayer->id);
        }

        // Apply search filter
        if ($request->filled('search')) {
            $searchTerm = "%{$request->search}%";
            $query->where(function ($q) use ($searchTerm) {
                $q->where('invoice_number', 'like', $searchTerm)
                    ->orWhere('transaction_id', 'like', $searchTerm)
                    ->orWhereHas('order', function ($orderQuery) use ($searchTerm) {
                        $orderQuery->where('order_number', 'like', $searchTerm);
                    });
            });
        }

        // Apply status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Apply payment method filter
        if ($request->filled('payment_method_id') && $request->payment_method_id !== 'all') {
            $query->where('payment_method_id', $request->payment_method_id);
        }

        // Apply date range filters
        if ($request->filled('date_from')) {
            $query->whereDate('payment_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('payment_date', '<=', $request->date_to);
        }

        // Get paginated results
        $payments = $query->paginate(15)->withQueryString();

        // Get active payment methods for filter dropdown
        $paymentMethods = PaymentMethod::active()
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('taxpayer/payment/index', [
            'payments' => $payments,
            'paymentMethods' => $paymentMethods,
            'filters' => $request->only([
                'search',
                'status',
                'payment_method_id',
                'date_from',
                'date_to'
            ]),
        ]);
    }

    /**
     * Store a newly created payment.
     */
    public function store(StoreRequest $request)
    {
        try {
            // Get validated data
            $validated = $request->validated();

            // Begin transaction
            DB::beginTransaction();

            // Find the order
            $order = StampOrder::find($validated['order_id']);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found or not available for payment.'
                ], 404);
            }

            // Get payment method
            $paymentMethod = PaymentMethod::find($validated['payment_method_id']);

            if (!$paymentMethod || !$paymentMethod->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Selected payment method is not available.'
                ], 400);
            }

            // Validate amount against method limits
            $settings = $paymentMethod->settings ?? [];
            if (isset($settings['min_amount']) && $order->grand_total < $settings['min_amount']) {
                return response()->json([
                    'success' => false,
                    'message' => "Minimum amount allowed for {$paymentMethod->name} is " . number_format($settings['min_amount'], 2) . " FC"
                ], 400);
            }

            if (isset($settings['max_amount']) && $order->grand_total > $settings['max_amount']) {
                return response()->json([
                    'success' => false,
                    'message' => "Maximum amount allowed for {$paymentMethod->name} is " . number_format($settings['max_amount'], 2) . " FC"
                ], 400);
            }

            // Generate invoice number
            $invoiceNumber = $this->generateInvoiceNumber();

            // Prepare payment provider response data
            $providerResponse = $this->buildProviderResponse($validated, $paymentMethod);

            // Create payment record
            $payment = Payment::create([
                'invoice_number' => $invoiceNumber,
                'order_id' => $order->id,
                'taxpayer_id' => $order->taxpayer_id,
                'amount' => $order->grand_total,
                'tax_amount' => $order->tax_amount,
                'penalty_amount' => $order->penalty_amount ?? 0,
                'total_amount' => $order->grand_total,
                'payment_method_id' => $paymentMethod->id,
                'payment_provider' => $this->determinePaymentProvider($validated, $paymentMethod),
                'transaction_id' => $validated['payment_reference'] ?? null,
                'status' => 'completed',
                'payment_date' => $validated['payment_date'],
                'payment_provider_response' => $providerResponse,
            ]);

            // Update order with payment information
            $order->update([
                'payment_method_id' => $paymentMethod->id,
                'payment_reference' => $validated['payment_reference'] ?? null,
                'payment_date' => $validated['payment_date'],
                'status' => 'in_production',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment initiated successfully',
                'payment' => $payment->load(['order', 'paymentMethod']),
                'redirect' => route('admin.orders.index', $payment->id)
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified payment.
     */
    public function show(string $id)
    {
        $payment = Payment::where('id', $id)
            ->where('taxpayer_id', Auth::user()->taxpayer->id)
            ->with([
                'order' => function ($q) {
                    $q->with(['product', 'stampType']);
                },
                'paymentMethod'
            ])
            ->firstOrFail();

        return Inertia::render('taxpayer/payment/show', [
            'payment' => $payment
        ]);
    }

    /**
     * Get payment receipt.
     */
    public function receipt(string $id)
    {
        $payment = Payment::where('id', $id)
            ->where('taxpayer_id', Auth::user()->taxpayer->id)
            ->with(['order', 'paymentMethod'])
            ->firstOrFail();

        if ($payment->status !== 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Receipt is only available for completed payments'
            ], 400);
        }

        return Inertia::render('taxpayer/payment/receipt', [
            'payment' => $payment
        ]);
    }

    /**
     * Update payment status (webhook/callback/admin).
     */
    public function updateStatus(Request $request, string $id)
    {
        $payment = Payment::with('order')->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'status' => ['required', Rule::in(['completed', 'failed', 'refunded'])],
            'transaction_id' => ['nullable', 'string', 'max:255'],
            'failure_reason' => ['required_if:status,failed', 'nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $oldStatus = $payment->status;

            // Update payment
            $payment->update([
                'status' => $request->status,
                'transaction_id' => $request->transaction_id ?? $payment->transaction_id,
                'confirmation_date' => $request->status === 'completed' ? now() : $payment->confirmation_date,
                'failure_reason' => $request->failure_reason,
            ]);

            // Update order status based on payment status
            if ($request->status === 'completed' && $oldStatus !== 'completed') {
                $payment->order->update([
                    'status' => 'paid',
                    'payment_date' => now(),
                ]);

                Log::info('Order marked as paid', [
                    'order_id' => $payment->order->id,
                    'payment_id' => $payment->id
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment status updated successfully',
                'payment' => $payment->load('paymentMethod')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment status update failed', [
                'error' => $e->getMessage(),
                'payment_id' => $payment->id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment status'
            ], 500);
        }
    }

    /**
     * Check payment status.
     */
    public function checkStatus(string $id)
    {
        $payment = Payment::where('id', $id)
            ->where('taxpayer_id', Auth::user()->taxpayer->id)
            ->with('paymentMethod')
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'status' => $payment->status,
            'payment' => [
                'id' => $payment->id,
                'invoice_number' => $payment->invoice_number,
                'status' => $payment->status,
                'amount' => $payment->amount,
                'payment_method' => $payment->paymentMethod?->name,
                'payment_date' => $payment->payment_date,
                'confirmation_date' => $payment->confirmation_date,
            ]
        ]);
    }

    /**
     * Cancel pending payment.
     */
    public function cancel(string $id)
    {
        $payment = Payment::where('id', $id)
            ->where('taxpayer_id', Auth::user()->taxpayer->id)
            ->where('status', 'pending')
            ->firstOrFail();

        try {
            DB::beginTransaction();

            $payment->update([
                'status' => 'failed',
                'failure_reason' => 'Payment cancelled by user'
            ]);

            DB::commit();

            Log::info('Payment cancelled by user', ['payment_id' => $payment->id]);

            return response()->json([
                'success' => true,
                'message' => 'Payment cancelled successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment cancellation failed', [
                'error' => $e->getMessage(),
                'payment_id' => $payment->id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel payment'
            ], 500);
        }
    }

    /**
     * Generate unique invoice number.
     */
    private function generateInvoiceNumber(): string
    {
        $prefix = 'INV';
        $year = date('Y');
        $month = date('m');

        $lastPayment = Payment::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->orderBy('created_at', 'desc')
            ->first();

        if ($lastPayment && preg_match('/INV-\d{4}-\d{2}-(\d+)/', $lastPayment->invoice_number, $matches)) {
            $sequence = intval($matches[1]) + 1;
        } else {
            $sequence = 1;
        }

        return sprintf('%s-%s-%s-%04d', $prefix, $year, $month, $sequence);
    }

    /**
     * Build provider response array based on payment method.
     */
    private function buildProviderResponse(array $validated, PaymentMethod $paymentMethod): array
    {
        $response = [
            'submitted_at' => now()->toDateTimeString(),
            'payment_method' => $paymentMethod->code,
        ];

        // Add method-specific fields
        switch ($paymentMethod->type) {
            case 'mobile_money':
                $response['phone_number'] = $validated['phone_number'] ?? null;
                break;
            case 'bank_transfer':
                $response['bank_name'] = $validated['bank_name'] ?? null;
                $response['bank_account_number'] = $validated['bank_account_number'] ?? null;
                break;
            case 'card':
                $response['card_provider'] = $validated['card_provider'] ?? null;
                break;
        }

        // Add reference if provided
        if (isset($validated['payment_reference'])) {
            $response['reference'] = $validated['payment_reference'];
        }

        // Add user IP and user agent for tracking
        $response['ip_address'] = request()->ip();
        $response['user_agent'] = request()->userAgent();

        return $response;
    }

    /**
     * Determine payment provider based on method and input.
     */
    private function determinePaymentProvider(array $validated, PaymentMethod $paymentMethod): ?string
    {
        // If provider is explicitly provided
        if (isset($validated['payment_provider'])) {
            return $validated['payment_provider'];
        }

        // Determine based on method type
        switch ($paymentMethod->type) {
            case 'mobile_money':
                // Extract provider from phone number or use method code
                return $paymentMethod->code;
            case 'card':
                return $validated['card_provider'] ?? 'card';
            case 'bank_transfer':
                return $validated['bank_name'] ?? 'bank';
            default:
                return $paymentMethod->code;
        }
    }
}