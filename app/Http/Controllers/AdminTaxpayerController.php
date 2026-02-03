<?php

namespace App\Http\Controllers;

use App\Models\Taxpayer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class AdminTaxpayerController extends Controller
{
    /**
     * Display a listing of taxpayers.
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $query = Taxpayer::with(['sector', 'legalForm', 'district', 'commune']);

            return DataTables::of($query)
                ->editColumn('status', function ($taxpayer) {
                    return $taxpayer->registration_status;
                })
                ->addColumn('sector_name', function ($taxpayer) {
                    return $taxpayer->sector->name ?? '-';
                })
                ->addColumn('actions', function ($taxpayer) {
                    return 'actions'; 
                })
                ->make(true);
        }

        return Inertia::render('admin/taxpayers/index');
    }

    /**
     * Approve a taxpayer registration.
     */
    public function approve(Taxpayer $taxpayer)
    {
        $taxpayer->update([
            'registration_status' => 'active', // Assuming active is the approved state
            'verification_date' => now(),
            'verified_by' => auth()->id(),
        ]);

        return response()->json(['message' => 'Taxpayer approved successfully.']);
    }

    /**
     * Reject a taxpayer registration.
     */
    public function reject(Taxpayer $taxpayer, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $taxpayer->update([
            'registration_status' => 'rejected',
            'rejection_reason' => $request->reason,
            'verified_by' => auth()->id(),
        ]);

        return response()->json(['message' => 'Taxpayer rejected successfully.']);
    }
}
