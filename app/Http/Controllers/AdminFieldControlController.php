<?php

namespace App\Http\Controllers;

use App\Models\FieldControl;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class AdminFieldControlController extends Controller
{
    /**
     * Display a listing of field controls.
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $query = FieldControl::with(['controlAgent', 'taxpayer', 'municipality']);

            return DataTables::of($query)
                ->addColumn('agent_name', function ($control) {
                    return $control->controlAgent->name ?? '-';
                })
                ->addColumn('taxpayer_name', function ($control) {
                    return $control->taxpayer->company_name ?? $control->business_name ?? '-';
                })
                ->addColumn('location', function ($control) {
                    return $control->municipality->name ?? $control->location_address ?? '-';
                })
                ->addColumn('compliance_rate', function ($control) {
                    return $control->compliance_rate . '%';
                })
                ->make(true);
        }

        // Get stats for the dashboard cards
        $stats = [
            'total' => FieldControl::count(),
            'completed' => FieldControl::completed()->count(),
            'in_progress' => FieldControl::inProgress()->count(),
            'requires_followup' => FieldControl::requiresFollowup()->count(),
            'today' => FieldControl::today()->count(),
            'this_month' => FieldControl::thisMonth()->count(),
        ];

        return Inertia::render('admin/field-controls/index', [
            'stats' => $stats
        ]);
    }

    /**
     * Get single field control details.
     */
    public function show(FieldControl $control)
    {
        $control->load(['controlAgent', 'taxpayer', 'municipality', 'stampVerifications']);
        
        return response()->json([
            'control' => $control,
            'agent' => $control->controlAgent,
            'taxpayer' => $control->taxpayer,
            'verifications' => $control->stampVerifications,
        ]);
    }

    /**
     * Approve a completed field control.
     */
    public function approve(FieldControl $control)
    {
        $control->update([
            'status' => 'approved',
        ]);

        return response()->json(['message' => 'Field control approved successfully.']);
    }

    /**
     * Reject/flag a field control.
     */
    public function reject(FieldControl $control, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $control->update([
            'status' => 'rejected',
            'observations' => $control->observations . "\n\nRejection Reason: " . $request->reason,
        ]);

        return response()->json(['message' => 'Field control flagged successfully.']);
    }
}
