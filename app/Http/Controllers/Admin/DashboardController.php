<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\FieldControl;
use App\Models\Stamp;
use App\Models\StampOrder;
use App\Models\StampType;
use App\Models\Taxpayer;
use App\Models\TaxpayerProduct;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // ── 1. KPI Stats with real month-over-month trends ──
        $now = Carbon::now();
        $startOfThisMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        $totalTaxpayers = Taxpayer::count();
        $taxpayersLastMonth = Taxpayer::where('created_at', '<', $startOfThisMonth)->count();

        $pendingOrders = StampOrder::whereIn('status', ['submitted', 'pending'])->count();
        $pendingOrdersLastMonth = StampOrder::whereIn('status', ['submitted', 'pending'])
            ->where('created_at', '<=', $endOfLastMonth)->count();

        $revenue = StampOrder::whereNotIn('status', ['cancelled', 'rejected'])->sum('grand_total');
        $revenueThisMonth = StampOrder::whereNotIn('status', ['cancelled', 'rejected'])
            ->where('created_at', '>=', $startOfThisMonth)->sum('grand_total');
        $revenueLastMonth = StampOrder::whereNotIn('status', ['cancelled', 'rejected'])
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->sum('grand_total');

        $activeStamps = Stamp::where('status', 'active')->count();
        if ($activeStamps === 0) {
            $activeStamps = StampOrder::whereIn('status', ['delivered', 'completed'])->sum('quantity');
        }
        $activeStampsLastMonth = Stamp::where('status', 'active')
            ->where('created_at', '<', $startOfThisMonth)->count();

        $stats = [
            [
                'title' => 'Total Taxpayers',
                'value' => number_format($totalTaxpayers),
                'change' => $this->calcTrend($totalTaxpayers, $taxpayersLastMonth),
                'trend' => $totalTaxpayers >= $taxpayersLastMonth ? 'up' : 'down',
                'description' => 'Registered enterprises',
                'icon' => 'Users',
            ],
            [
                'title' => 'Pending Orders',
                'value' => number_format($pendingOrders),
                'change' => $this->calcTrend($pendingOrders, $pendingOrdersLastMonth),
                'trend' => $pendingOrders <= $pendingOrdersLastMonth ? 'up' : 'down',
                'description' => 'Awaiting approval',
                'icon' => 'FileText',
            ],
            [
                'title' => 'Revenue (CDF)',
                'value' => $this->formatMoney($revenue),
                'change' => $this->calcTrend($revenueThisMonth, $revenueLastMonth),
                'trend' => $revenueThisMonth >= $revenueLastMonth ? 'up' : 'down',
                'description' => 'Total Revenue',
                'icon' => 'CreditCard',
            ],
            [
                'title' => 'Active Stamps',
                'value' => number_format($activeStamps),
                'change' => $this->calcTrend($activeStamps, $activeStampsLastMonth),
                'trend' => $activeStamps >= $activeStampsLastMonth ? 'up' : 'down',
                'description' => 'In circulation',
                'icon' => 'Stamp',
            ],
        ];

        // ── 2. Order Status Donut ──
        $orderStatusCounts = StampOrder::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')->get();
        $totalOrders = $orderStatusCounts->sum('total');

        $statusColors = [
            'delivered' => '#10B981', 'completed' => '#10B981',
            'approved'  => '#3B82F6', 'in_production' => '#6366F1',
            'submitted' => '#F59E0B', 'pending' => '#F59E0B',
            'processing' => '#3B82F6',
            'cancelled' => '#EF4444', 'rejected' => '#EF4444',
        ];

        $orderStatusData = $orderStatusCounts->map(fn($item) => [
            'label' => ucfirst(str_replace('_', ' ', $item->status)),
            'value' => $totalOrders > 0 ? round(($item->total / $totalOrders) * 100) : 0,
            'count' => $item->total,
            'color' => $statusColors[$item->status] ?? '#64748B',
        ])->values();

        // ── 3. Monthly Revenue (last 6 months) ──
        $revenueData = StampOrder::whereNotIn('status', ['cancelled', 'rejected'])
            ->where('created_at', '>=', $now->copy()->subMonths(6)->startOfMonth())
            ->get()
            ->groupBy(fn($o) => Carbon::parse($o->created_at)->format('M'))
            ->map(fn($rows) => $rows->sum('grand_total') / 1000000);

        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $m = $now->copy()->subMonths($i)->format('M');
            $months[] = ['month' => $m, 'value' => round($revenueData->get($m, 0), 1)];
        }

        $revenueTrend = $this->calcTrend($revenueThisMonth, $revenueLastMonth);

        // ── 4. Quick Action counts (real data) ──
        $quickActions = [
            'pendingOrders'        => StampOrder::whereIn('status', ['submitted', 'pending'])->count(),
            'pendingVerifications'  => StampOrder::where('status', 'approved')->count(),
            'activeComplaints'     => Complaint::where('status', 'open')->count(),
            'newRegistrations'     => Taxpayer::where('registration_status', 'pending')->count(),
            'pendingProducts'      => TaxpayerProduct::where('status', 'pending')->count(),
        ];

        // ── 5. Stamp Distribution by Type ──
        $stampDistribution = StampType::withCount('stamps')
            ->where('is_active', true)
            ->get()
            ->map(fn($type) => [
                'label' => $type->name,
                'count' => $type->stamps_count,
            ]);

        $totalStampCount = $stampDistribution->sum('count');
        $typeColors = ['#003366', '#0052A3', '#FFD700', '#10B981', '#6366F1', '#EC4899'];
        $stampDistribution = $stampDistribution->values()->map(function ($item, $idx) use ($totalStampCount, $typeColors) {
            return [
                'label' => $item['label'],
                'value' => $totalStampCount > 0 ? round(($item['count'] / $totalStampCount) * 100) : 0,
                'color' => $typeColors[$idx % count($typeColors)],
            ];
        });

        // ── 6. Recent Transactions ──
        $recentTransactions = StampOrder::with('taxpayer')
            ->latest()->take(5)->get()
            ->map(fn($order) => [
                'company' => $order->taxpayer->company_name ?? 'Unknown',
                'action'  => 'Order ' . str_replace('_', ' ', $order->status),
                'amount'  => number_format($order->quantity) . ' stamps',
                'time'    => $order->created_at->diffForHumans(),
                'status'  => in_array($order->status, ['delivered', 'completed']) ? 'success' : 'pending',
            ]);

        return Inertia::render('admin/dashboard', [
            'stats'              => $stats,
            'orderStatusData'    => $orderStatusData,
            'monthlyRevenue'     => $months,
            'revenueTrend'       => $revenueTrend,
            'quickActions'       => $quickActions,
            'stampDistribution'  => $stampDistribution,
            'recentTransactions' => $recentTransactions,
        ]);
    }

    private function calcTrend(float $current, float $previous): string
    {
        if ($previous == 0) {
            return $current > 0 ? '+100%' : '0%';
        }
        $pct = round((($current - $previous) / $previous) * 100, 1);
        return ($pct >= 0 ? '+' : '') . $pct . '%';
    }

    private function formatMoney(float $amount): string
    {
        if ($amount >= 1000000) return round($amount / 1000000, 1) . 'M';
        if ($amount >= 1000) return round($amount / 1000, 1) . 'K';
        return number_format($amount);
    }
}
