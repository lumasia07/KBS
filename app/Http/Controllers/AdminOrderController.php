<?php

namespace App\Http\Controllers;

use App\Models\StampOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class AdminOrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $query = StampOrder::with(['taxpayer', 'product']);

            return DataTables::of($query)
                ->editColumn('status', function ($order) {
                    return $order->status;
                })
                ->editColumn('created_at', function ($order) {
                    return $order->created_at->format('Y-m-d H:i');
                })
                ->addColumn('taxpayer_name', function ($order) {
                    return $order->taxpayer->company_name ?? 'Unknown';
                })
                ->addColumn('product_name', function ($order) {
                    return $order->product->name ?? 'Unknown';
                })
                ->addColumn('actions', function ($order) {
                    return 'actions'; // Placeholder, frontend handles UI
                })
                ->make(true);
        }

        return Inertia::render('admin/orders/index');
    }

    /**
     * Approve the specified order.
     */
    public function approve(StampOrder $order)
    {
        // Only allow approving submitted or pending orders
        if (!in_array($order->status, ['submitted', 'pending'])) {
            return response()->json(['message' => 'Order cannot be approved in current status.'], 422);
        }

        $order->update([
            'status' => 'approved',
        ]);

        return response()->json(['message' => 'Order approved successfully.']);
    }

    /**
     * Reject the specified order.
     */
    public function reject(StampOrder $order, Request $request)
    {
        if (!in_array($order->status, ['submitted', 'pending'])) {
            return response()->json(['message' => 'Order cannot be rejected.'], 422);
        }

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $order->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
        ]);

        return response()->json(['message' => 'Order rejected successfully.']);
    }
    
    /**
     * Mark order as Delivered (Optional for this flow but useful)
     */
    public function deliver(StampOrder $order)
    {
        // Logic to generate stamps would go here or in a service
        $order->update(['status' => 'delivered']);
        return back()->with('success', 'Order marked as delivered.');
    }
}
