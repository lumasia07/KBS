<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GenerateStampsRequest;
use App\Http\Resources\Admin\ProductionResource;
use App\Models\StampOrder;
use App\Services\Admin\ProductionService;
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
     * Display a listing of orders ready for production.
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            // Only orders that are 'approved' are ready for production
            $query = StampOrder::with(['taxpayer', 'product', 'stampType', 'stamps'])
                ->where('status', 'approved')
                ->orWhere('status', 'production_queued')
                ->orWhere('status', 'in_production')
                ->orWhere('status', 'produced');

            return DataTables::of($query)
                ->editColumn('status', function ($order) {
                    return view('admin.production.partials.status-badge', ['status' => $order->status])->render();
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
                ->addColumn('actions', function ($order) {
                    return view('admin.production.partials.actions', ['order' => $order])->render();
                })
                ->rawColumns(['status', 'actions'])
                ->make(true);
        }

        return Inertia::render('admin/production/index', [
            'stats' => [
                'pending' => StampOrder::where('status', 'approved')->count(),
                'in_production' => StampOrder::where('status', 'in_production')->count(),
                'produced' => StampOrder::where('status', 'produced')->count(),
                'total_stamps' => StampOrder::where('status', 'produced')->sum('quantity'),
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
     * Cancel production for an order.
     */
    public function cancel(StampOrder $order, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        if (!in_array($order->status, ['approved', 'production_queued'])) {
            return response()->json([
                'message' => 'Cannot cancel production for orders in this status.'
            ], 422);
        }

        $order->update([
            'status' => 'production_cancelled',
            'rejection_reason' => $request->reason,
        ]);

        return response()->json([
            'message' => 'Production cancelled successfully.'
        ]);
    }
}