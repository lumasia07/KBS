<?php

namespace App\Http\Controllers\Taxpayer;

use App\Http\Controllers\Controller;
use App\Models\Stamp;
use App\Models\StampOrder;
use App\Models\Taxpayer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Check if user has taxpayer relationship
        if (!$user || !$user->taxpayer) {
            return redirect()->route('dashboard')
                ->with('error', 'Taxpayer profile not found.');
        }

        $taxpayer = $user->taxpayer;

        // Get current year data
        $currentYear = Carbon::now()->year;
        $previousYear = Carbon::now()->subYear()->year;

        // Get orders with proper error handling
        $totalOrders = StampOrder::where('taxpayer_id', $taxpayer->id)->count();

        $pendingOrders = StampOrder::where('taxpayer_id', $taxpayer->id)
            ->whereIn('status', ['pending', 'processing'])
            ->count();

        // Get active stamps
        $currentActiveStamps = Stamp::where('taxpayer_id', $taxpayer->id)
            ->where('status', 'active')
            ->count();

        $previousActiveStamps = Stamp::where('taxpayer_id', $taxpayer->id)
            ->where('status', 'active')
            ->whereYear('created_at', $previousYear)
            ->count();

        // Get recent orders
        $recentOrders = StampOrder::where('taxpayer_id', $taxpayer->id)
            ->with(['stampType'])
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number ?? 'N/A',
                    'type' => $order->stampType->name ?? 'Unknown',
                    'quantity' => $order->quantity ?? 0,
                    'amount' => $order->total_amount ?? 0,
                    'status' => $order->status ?? 'pending',
                    'created_at' => $order->created_at ? $order->created_at->toISOString() : Carbon::now()->toISOString(),
                    'can_download' => ($order->status === 'delivered' && $order->certificate_id) ?? false,
                ];
            });

        // Get yearly comparison for orders
        $lastYearOrders = StampOrder::where('taxpayer_id', $taxpayer->id)
            ->whereYear('created_at', $previousYear)
            ->count();

        // Check if can place order
        $canPlaceOrder = $this->checkIfCanPlaceOrder($taxpayer->id);

        return Inertia::render('taxpayer/dashboard', [
            'taxpayer' => [
                'id' => $taxpayer->id ?? null,
                'name' => $taxpayer->name ?? 'N/A',
                'company_name' => $taxpayer->company_name ?? 'N/A',
                'email' => $taxpayer->email ?? 'N/A',
                'tax_identification_number' => $taxpayer->tax_identification_number ?? 'N/A',
            ],
            'stats' => [
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'totalSpent' => [
                    'current' => 0, // You'll replace with actual transaction data
                    'previous' => 0,
                    'change' => 0,
                ],
                'activeStamps' => [
                    'current' => $currentActiveStamps,
                    'previous' => $previousActiveStamps,
                    'change' => $previousActiveStamps > 0
                        ? (($currentActiveStamps - $previousActiveStamps) / $previousActiveStamps) * 100
                        : ($currentActiveStamps > 0 ? 100 : 0),
                ],
            ],
            'recentOrders' => $recentOrders,
            'quickActions' => [
                'canPlaceOrder' => $canPlaceOrder,
                'hasPendingPayments' => false, // Replace with actual logic
                'certificatesAvailable' => false, // Replace with actual logic
            ],
            'yearlyComparison' => [
                'orders' => $lastYearOrders,
                'spent' => 0, // Replace with actual data
            ],
        ]);
    }

    /**
     * Check if taxpayer can place a new order
     */
    /**
     * Check if taxpayer can place a new order
     */
    private function checkIfCanPlaceOrder(int|string $taxpayerId): bool
    {
        try {
            // Cast to int if it's a string
            $taxpayerId = (int) $taxpayerId;

            // Example logic: Check if taxpayer has no unpaid orders
            $hasUnpaidOrders = StampOrder::where('taxpayer_id', $taxpayerId)
                ->where('payment_status', 'pending')
                ->where('created_at', '>', Carbon::now()->subDays(30))
                ->exists();

            if ($hasUnpaidOrders) {
                return false;
            }

            // Check if taxpayer is active and compliant
            $taxpayer = Taxpayer::find($taxpayerId);
            if (!$taxpayer || ($taxpayer->status ?? 'active') !== 'active') {
                return false;
            }

            return true;
        } catch (\Exception $e) {
            // Log error and return default value
            Log::error('Error in checkIfCanPlaceOrder: ' . $e->getMessage());
            return true; // Default to allowing orders
        }
    }
}
