<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GenerateStampsRequest;
use App\Http\Resources\Admin\ProductionResource;
use App\Models\StampOrder;
use App\Services\ProductionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;
use Illuminate\Support\Facades\Log;

class ProductionController extends Controller
{
    protected ProductionService $productionService;

    public function __construct(ProductionService $productionService)
    {
        $this->productionService = $productionService;
    }

    /**
     * Return serial range for an order — actual if stamps exist, estimated if not.
     */
    public function preview(StampOrder $order)
    {
        // If stamps already generated, return actual range
        $existingFirst = $order->stamps()->orderBy('serial_number', 'asc')->first();
        if ($existingFirst) {
            $existingLast = $order->stamps()->orderBy('serial_number', 'desc')->first();
            return response()->json([
                'serial_start' => $existingFirst->serial_number,
                'serial_end' => $existingLast->serial_number,
                'quantity' => $order->stamps()->count(),
                'generated' => true,
            ]);
        }

        // Otherwise estimate
        $lastSerial = \App\Models\Stamp::whereYear('created_at', date('Y'))
            ->orderBy('serial_number', 'desc')
            ->first();

        $lastNum = 0;
        if ($lastSerial) {
            preg_match('/-(\d+)$/', $lastSerial->serial_number, $m);
            $lastNum = isset($m[1]) ? (int) $m[1] : 0;
        }

        return response()->json([
            'serial_start' => sprintf('KBS-%s-%06d', date('Y'), $lastNum + 1),
            'serial_end' => sprintf('KBS-%s-%06d', date('Y'), $lastNum + $order->quantity),
            'quantity' => $order->quantity,
            'generated' => false,
        ]);
    }

    /**
     * Display a listing of orders ready for production.
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            // Only orders that are 'approved' or in production pipeline
            $query = StampOrder::with(['taxpayer', 'product', 'stampType'])
                ->withCount('stamps')
                ->whereIn('status', ['approved', 'in_production', 'ready_for_delivery']);

            return DataTables::of($query)
                ->editColumn('status', function ($order) {
                    return $order->status;
                })
                ->addColumn('taxpayer_name', function ($order) {
                    return $order->taxpayer->company_name ?? 'N/A';
                })
                ->addColumn('taxpayer_tin', function ($order) {
                    return $order->taxpayer->taxpayer_number ?? 'N/A';
                })
                ->addColumn('product_name', function ($order) {
                    return $order->product->name ?? 'N/A';
                })
                ->addColumn('stamp_type', function ($order) {
                    return $order->stampType->name ?? 'N/A';
                })
                ->addColumn('stamps_count', function ($order) {
                    return $order->stamps_count ?? 0;
                })
                ->make(true);
        }

        return Inertia::render('admin/production/index', [
            'stats' => [
                'pending' => StampOrder::where('status', 'approved')->count(),
                'in_production' => StampOrder::where('status', 'in_production')->count(),
                'produced' => StampOrder::where('status', 'ready_for_delivery')->count(),
                'total_stamps' => StampOrder::where('status', 'ready_for_delivery')->sum('quantity'),
            ]
        ]);
    }

    /**
     * Show production details for a specific order.
     */
    public function show(StampOrder $order)
    {
        $order->load([
            'taxpayer',
            'product',
            'stampType',
            'stamps' => function ($query) {
                $query->latest()->limit(100); // Show recent 100 stamps
            }
        ]);

        return Inertia::render('admin/production/show', [
            'order' => new ProductionResource($order),
            'stamps' => $order->stamps,
        ]);
    }

    /**
     * Generate stamps for an order.
     */
    public function generate(GenerateStampsRequest $request, StampOrder $order)
    {
        try {
            $result = $this->productionService->startProduction($order, $request->user());

            if (!$result['success']) {
                return response()->json([
                    'message' => $result['message'],
                ], 422);
            }

            return response()->json([
                'message' => $result['message'],
                'batch_id' => $result['batch_id'],
                'preview_data' => $result['preview_data'],
            ]);

        } catch (\Exception $e) {
            Log::error('Production generation failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to start production: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check production progress for a batch.
     */
    public function progress(Request $request, string $batchId)
    {
        $progress = $this->productionService->getProgress($batchId);

        return response()->json($progress);
    }

    /**
     * Render a printable batch sheet (landscape A4, KEBS-style stamps).
     */
    public function printBatch(StampOrder $order)
    {
        $order->load(['taxpayer', 'product', 'stampType']);

        $stamps = $order->stamps()
            ->orderBy('serial_number')
            ->get(['id', 'serial_number', 'qr_code', 'production_batch']);

        if ($stamps->isEmpty()) {
            abort(404, 'No stamps generated for this order yet.');
        }

        return response()->view('admin.production.print-batch', [
            'order' => $order,
            'stamps' => $stamps,
        ]);
    }

    /**
     * Get stamps for an order (paginated).
     */
    public function stamps(StampOrder $order, Request $request)
    {
        $stamps = $order->stamps()
            ->orderBy('serial_number')
            ->paginate($request->get('per_page', 50));

        return response()->json([
            'data' => $stamps->items(),
            'meta' => [
                'current_page' => $stamps->currentPage(),
                'last_page' => $stamps->lastPage(),
                'per_page' => $stamps->perPage(),
                'total' => $stamps->total(),
            ]
        ]);
    }

    /**
     * Mark an order as ready for delivery after printing.
     */
    public function markReady(StampOrder $order)
    {
        if (!in_array($order->status, ['in_production', 'ready_for_delivery'])) {
            return response()->json([
                'message' => 'Order must be in production to mark as ready.'
            ], 422);
        }

        $order->update(['status' => 'ready_for_delivery']);

        return response()->json([
            'message' => 'Order marked as ready for delivery.'
        ]);
    }

    /**
     * Cancel production for an order.
     */
    public function cancel(StampOrder $order, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        if (!in_array($order->status, ['approved', 'in_production'])) {
            return response()->json([
                'message' => 'Cannot cancel production for orders in this status.'
            ], 422);
        }

        $order->update([
            'status' => 'cancelled',
            'rejection_reason' => $request->reason,
        ]);

        return response()->json([
            'message' => 'Production cancelled successfully.'
        ]);
    }
}