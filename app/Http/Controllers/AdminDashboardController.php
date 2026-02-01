<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Stamp;
use App\Models\StampOrder;
use App\Models\Taxpayer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // 1. KPI Stats
        $totalTaxpayers = Taxpayer::count();
        
        // Count orders that need attention (submitted/pending)
        $pendingOrders = StampOrder::whereIn('status', ['submitted', 'pending'])->count();

        // Calculate Revenue (Approximation based on grand_total of valid orders)
        // Adjust statuses based on your workflow. Assuming 'submitted' might be unpaid, 
        // but for now we sum all non-cancelled for visibility, or strictly paid ones.
        // Let's sum everything not cancelled/rejected.
        $revenue = StampOrder::whereNotIn('status', ['cancelled', 'rejected'])
            ->sum('grand_total');
        
        // For 'active', check if we have stamps. If not, use proxy.
        $activeStamps = Stamp::where('status', 'active')->count();
        if ($activeStamps === 0) {
            // Proxy: Sum quantity of approved/delivered orders
            $activeStamps = StampOrder::whereIn('status', ['delivered', 'completed'])
                ->sum('quantity');
        }

        // Calculate trends (Simple comparison with last month)
        // This requires more complex queries. For MVP, we can mock the trend % or calculate it.
        // Let's just pass 0% or calculate if easy.
        
        $stats = [
            [
                'title' => 'Total Taxpayers',
                'value' => number_format($totalTaxpayers),
                'change' => '+0%', // Placeholder
                'trend' => 'up',
                'description' => 'Registered enterprises',
                'icon' => 'Users' // Frontend maps this string to Icon component
            ],
            [
                'title' => 'Pending Orders',
                'value' => number_format($pendingOrders),
                'change' => '0%',
                'trend' => 'up',
                'description' => 'Awaiting approval',
                'icon' => 'FileText'
            ],
            [
                'title' => 'Revenue (CDF)',
                'value' => $this->formatMoney($revenue),
                'change' => '+0%',
                'trend' => 'up',
                'description' => 'Total Revenue',
                'icon' => 'CreditCard'
            ],
            [
                'title' => 'Active Stamps',
                'value' => number_format($activeStamps),
                'change' => '0%',
                'trend' => 'down',
                'description' => 'In circulation',
                'icon' => 'Stamp'
            ]
        ];

        // 2. Charts - Order Status
        $orderStatusCounts = StampOrder::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();
        
        $totalOrders = $orderStatusCounts->sum('total');
        
        $orderStatusData = $orderStatusCounts->map(function($item) use ($totalOrders) {
            $colors = [
                'delivered' => '#10B981',
                'completed' => '#10B981',
                'submitted' => '#F59E0B',
                'pending' => '#F59E0B',
                'processing' => '#3B82F6',
                'cancelled' => '#EF4444',
                'rejected' => '#EF4444',
            ];
            
            return [
                'label' => ucfirst($item->status),
                'value' => $totalOrders > 0 ? round(($item->total / $totalOrders) * 100) : 0,
                'color' => $colors[$item->status] ?? '#64748B'
            ];
        })->values();

        // 3. Charts - Monthly Revenue
        // Group by Month (last 6 months)
        $monthlyRevenue = StampOrder::whereNotIn('status', ['cancelled', 'rejected'])
            ->select(
                DB::raw("to_char(created_at, 'Mon') as month"), // Oracle/Postgres syntax?
                // User is on WSL Ubuntu, likely standard Laravel/MySQL or Postgres.
                // If using SQLite/MySQL, syntax differs.
                // Safer to use Carbon loop or check driver.
                // Assuming standardized DB usage allowed. 
                // Let's use get() then map for portability if dataset is small.
                // Or simplified DB::raw.
                // Let's try flexible approach:
                 DB::raw('SUM(grand_total) as value')
            )
            ->where('created_at', '>=', now()->subMonths(6))
             // Group by date format is tricky across DBs without specific driver knowledge
             // Let's stick to reliable collection method for MVP
        ;
        
        // Portable Collection Method for Monthly Revenue
        $revenueData = StampOrder::whereNotIn('status', ['cancelled', 'rejected'])
            ->where('created_at', '>=', now()->subMonths(6))
            ->get()
            ->groupBy(function($date) {
                return Carbon::parse($date->created_at)->format('M'); // Jan, Feb
            })
            ->map(function ($row) {
                return $row->sum('grand_total') / 1000000; // In Millions
            });
            
        // Ensure ordering by months
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i)->format('M');
            $months[] = [
                'month' => $month,
                'value' => round($revenueData->get($month, 0), 1)
            ];
        }

        // 4. Recent Transactions
        // Mix of recent orders
        $recentTransactions = StampOrder::with('taxpayer')
            ->latest()
            ->take(5)
            ->get()
            ->map(function($order) {
                return [
                    'company' => $order->taxpayer->company_name ?? 'Unknown',
                    'action' => 'Order placed',
                    'amount' => number_format($order->quantity) . ' stamps',
                    'time' => $order->created_at->diffForHumans(),
                    'status' => in_array($order->status, ['delivered', 'completed']) ? 'success' : 'pending'
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'orderStatusData' => $orderStatusData,
            'monthlyRevenue' => $months,
            'recentTransactions' => $recentTransactions
        ]);
    }

    private function formatMoney($amount)
    {
        if ($amount >= 1000000) {
            return round($amount / 1000000, 1) . 'M';
        }
        if ($amount >= 1000) {
            return round($amount / 1000, 1) . 'K';
        }
        return number_format($amount);
    }
}
