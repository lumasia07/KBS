<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StampOrder;
use App\Models\StampType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Yajra\DataTables\Facades\DataTables;

class TaxpayerOrderController extends Controller
{
    /**
     * Display the order page.
     */
    public function index()
    {
        return Inertia::render('taxpayer/order');
    }

    /**
     * Get products available for ordering stamps.
     * Returns products registered to the taxpayer that are active.
     */
    public function products()
    {
        $taxpayer = Auth::user()->taxpayer;

        if (!$taxpayer) {
            return response()->json([]);
        }

        $products = $taxpayer->products()
            ->wherePivot('status', 'active')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'code' => $product->code,
                    'name' => $product->name,
                    'description' => $product->description,
                    'category' => $product->category ? $product->category->name : 'Uncategorized',
                    'unit_type' => $product->unit_type,
                    'stamp_price_per_unit' => (float) $product->stamp_price_per_unit,
                    'requires_health_certificate' => (boolean) $product->requires_health_certificate,
                    'is_active' => (boolean) $product->is_active,
                    'registration_date' => $product->pivot->registration_date,
                    'health_certificate_number' => $product->pivot->health_certificate_number,
                    'health_certificate_expiry' => $product->pivot->health_certificate_expiry,
                ];
            });

        return response()->json($products);
    }

    /**
     * Store a newly created order in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.packaging_type' => 'required|string',
            'delivery_method' => 'required|string',
            'delivery_address' => 'nullable|string',
            'payment_method' => 'required|string',
            'order_notes' => 'nullable|string',
        ]);

        $taxpayer = Auth::user()->taxpayer;

        if (!$taxpayer) {
            return response()->json(['message' => 'Taxpayer not found'], 404);
        }

        DB::beginTransaction();

        try {
            $orders = [];
            $year = now()->year;

            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);

                // Calculate costs
                $unitPrice = $product->stamp_price_per_unit;
                $quantity = $item['quantity'];
                $totalAmount = $unitPrice * $quantity;
                $taxRate = 0.16; // 16% VAT
                $taxAmount = $totalAmount * $taxRate;
                $grandTotal = $totalAmount + $taxAmount;

                $randomStr = strtoupper(Str::random(5));
                $orderNumber = "KBS-ORDER-{$year}-{$randomStr}";

                $stampType = StampType::first();
                $order = StampOrder::create([
                    'order_number' => $orderNumber,
                    'taxpayer_id' => $taxpayer->id,
                    'product_id' => $product->id,
                    'stamp_type_id' => $stampType ? $stampType->id : 1,
                    'quantity' => $quantity,
                    'packaging_type' => 'pack',
                    'unit_price' => $unitPrice,
                    'total_amount' => $totalAmount,
                    'tax_amount' => $taxAmount,
                    'penalty_amount' => 0,
                    'grand_total' => $grandTotal,
                    'status' => 'submitted', // Initial status
                    'payment_method' => $request->payment_method,
                    'delivery_method' => $request->delivery_method,
                    'delivery_address' => $request->delivery_address,
                    'submitted_by' => Auth::id(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $orders[] = $order;
            }

            DB::commit();

            return response()->json([
                'message' => 'Order submitted successfully',
                'order' => $orders[0]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order submission failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to submit order', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get order history.
     */
    public function history(Request $request)
    {
        $taxpayer = Auth::user()->taxpayer;

        if (!$taxpayer) {
            return response()->json([]);
        }

        $query = StampOrder::where('taxpayer_id', $taxpayer->id)
            ->with(['product'])
            ->select('stamp_orders.*');

        return DataTables::of($query)
            ->editColumn('status', function ($order) {
                return $order->status;
            })
            ->editColumn('created_at', function ($order) {
                return $order->created_at->format('Y-m-d H:i');
            })
            ->editColumn('grand_total', function ($order) {
                return $order->grand_total;
            })
            ->filterColumn('product_name', function ($query, $keyword) {
                $query->whereHas('product', function ($q) use ($keyword) {
                    $q->where('name', 'like', "%{$keyword}%");
                });
            })
            ->addColumn('product_name', function ($order) {
                return $order->product ? $order->product->name : 'Unknown';
            })
            ->addColumn('actions', function ($order) {
                // Placeholder, frontend handles UI
            })
            ->make(true);
    }
}
