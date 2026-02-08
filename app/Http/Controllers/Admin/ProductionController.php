<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StampOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class ProductionController extends Controller
{
    /**
     * Display a listing of orders ready for production.
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            // Only orders that are 'approved' are ready for production
            $query = StampOrder::with(['taxpayer', 'product'])
                ->where('status', 'approved');

            return DataTables::of($query)
                ->editColumn('status', function ($order) {
                    return $order->status;
                })
                ->addColumn('taxpayer_name', function ($order) {
                    return $order->taxpayer->company_name ?? 'Unknown';
                })
                ->addColumn('product_name', function ($order) {
                    return $order->product->name ?? 'Unknown';
                })
                ->addColumn('actions', function ($order) {
                    return 'actions';
                })
                ->make(true);
        }

        return Inertia::render('admin/production/index');
    }

    /**
     * Generate stamps (Stub).
     */
    public function generate(StampOrder $order)
    {
        // Update status to in_production
        $order->update(['status' => 'in_production']);

        // In a real app, this would dispatch a Job to generate serials
        // Here we just return a success message or mock data for the UI

        return response()->json([
            'message' => 'Production batch started successfully.',
            'batch_id' => 'BATCH-' . Date('Ymd') . '-' . $order->id,
            'preview_data' => [
                'serial_start' => 'KBS-' . date('Y') . '-00001',
                'serial_end' => 'KBS-' . date('Y') . '-' . str_pad($order->quantity, 5, '0', STR_PAD_LEFT),
                'quantity' => $order->quantity
            ]
        ]);
    }
}
