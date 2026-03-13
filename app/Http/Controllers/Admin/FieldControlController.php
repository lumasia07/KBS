<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FieldControl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class FieldControlController extends Controller
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
                    return $control->controlAgent->name ?? 'sjpwn';
                })
                ->addColumn('taxpayer_name', function ($control) {
                    return $control->taxpayer->company_name ?? $control->business_name ?? '-';
                })
                ->addColumn('location', function ($control) {
                    return $control->municipality->name ?? $control->location_address ?? '-';
                })
                ->addColumn('compliance_rate', function ($control) {
                    return $control->compliance_rate;
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
        $control->setAttribute('compliance_rate', $control->compliance_rate);

        $agentName = $control->controlAgent->name ?? 'sjpwn';

        return response()->json([
            'control' => $control,
            'agent' => $control->controlAgent,
            'agent_name' => $agentName,
            'taxpayer' => $control->taxpayer,
            'verifications' => $control->stampVerifications,
        ]);
    }

    /**
     * Stream a field-control attachment (photo/document) through authorized admin route.
     */
    public function attachment(FieldControl $control, Request $request)
    {
        $rawPath = trim((string) $request->query('path', ''));
        if ($rawPath === '') {
            abort(400, 'Missing attachment path');
        }

        $normalize = function (?string $value): string {
            $value = (string) $value;
            $parsedPath = parse_url($value, PHP_URL_PATH);
            $path = $parsedPath ?: $value;
            $path = ltrim($path, '/');
            if (str_starts_with($path, 'storage/')) {
                $path = substr($path, strlen('storage/'));
            }
            return $path;
        };

        $requestedPath = $normalize($rawPath);

        $photos = collect($control->photos_paths ?? [])->map(fn($path) => $normalize((string) $path));
        $documents = collect($control->documents_paths ?? [])->map(fn($path) => $normalize((string) $path));
        $allowed = $photos->merge($documents)->filter()->values();

        if (!$allowed->contains($requestedPath)) {
            abort(403, 'Attachment not linked to this inspection');
        }

        if (!Storage::disk('public')->exists($requestedPath)) {
            abort(404, 'Attachment not found');
        }

        return Storage::disk('public')->response($requestedPath);
    }

    /**
     * Approve a completed field control.
     */
    public function approve(FieldControl $control)
    {
        $adminNote = now()->format('Y-m-d H:i') . ' - Admin review approved.';

        $control->update([
            'status' => 'completed',
            'review_status' => 'approved',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'review_notes' => $adminNote,
            'recommendations' => trim(($control->recommendations ? $control->recommendations . "\n\n" : '') . $adminNote),
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

        $adminFlagNote = now()->format('Y-m-d H:i') . ' - Admin follow-up required: ' . $request->reason;

        $control->update([
            'status' => 'requires_followup',
            'review_status' => 'returned',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'review_notes' => $adminFlagNote,
            'observations' => trim(($control->observations ? $control->observations . "\n\n" : '') . $adminFlagNote),
        ]);

        return response()->json(['message' => 'Field control flagged successfully.']);
    }
}
