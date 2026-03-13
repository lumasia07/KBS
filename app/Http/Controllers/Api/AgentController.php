<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FieldControl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AgentController extends Controller
{
    public function dashboard(Request $request)
    {
        $agentId = $request->user()->id;

        $stats = [
            'today_inspections' => FieldControl::where('control_agent_id', $agentId)->today()->count(),
            'completed' => FieldControl::where('control_agent_id', $agentId)->today()->completed()->count(),
            'violations' => FieldControl::where('control_agent_id', $agentId)->today()->where('offence_declared', true)->count(),
            'stamps_verified' => FieldControl::where('control_agent_id', $agentId)->today()->sum('total_items_checked'),
        ];

        $todaySchedule = FieldControl::where('control_agent_id', $agentId)
            ->today()
            ->with('taxpayer')
            ->orderBy('control_date')
            ->get()
            ->map(function ($control) {
                return [
                    'id' => $control->id,
                    'time' => $control->control_date->format('H:i'),
                    'company' => $control->taxpayer?->company_name ?? $control->business_name,
                    'address' => $control->location_address,
                    'type' => ucfirst(str_replace('_', ' ', $control->control_type)),
                    'status' => $control->status,
                ];
            });

        $recentInspections = FieldControl::where('control_agent_id', $agentId)
            ->completed()
            ->orderBy('control_date', 'desc')
            ->take(5)
            ->get()
            ->map(function ($control) {
                return [
                    'id' => $control->id,
                    'company' => $control->taxpayer?->company_name ?? $control->business_name,
                    'result' => $control->non_compliant_items === 0 ? 'passed' : 'failed',
                    'stampsVerified' => $control->total_items_checked,
                    'violations' => $control->offence_declared ? 1 : 0,
                    'date' => $control->control_date->isToday() ? 'Today' : ($control->control_date->isYesterday() ? 'Yesterday' : $control->control_date->format('M d')),
                ];
            });

        return response()->json([
            'stats' => $stats,
            'todaySchedule' => $todaySchedule,
            'recentInspections' => $recentInspections,
        ]);
    }

    public function inspections(Request $request)
    {
        $agentId = $request->user()->id;
        
        $query = FieldControl::where('control_agent_id', $agentId)
            ->with('taxpayer')
            ->orderBy('control_date', 'desc');

        $inspections = $query->paginate(20);

        return response()->json($inspections);
    }

    public function showInspection($id)
    {
        $control = FieldControl::with(['taxpayer', 'stampVerifications'])->findOrFail($id);

        if ($control->control_agent_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($control);
    }

    public function storeInspection(Request $request)
    {
        $validated = $request->validate([
            'taxpayer_id' => 'nullable|exists:taxpayers,id',
            'business_name' => 'required|string|max:255',
            'location_address' => 'required|string|max:500',
            'control_type' => 'required|in:routine,random,targeted,complaint_based',
            'total_items_checked' => 'required|integer|min:0',
            'compliant_items' => 'required|integer|min:0',
            'non_compliant_items' => 'required|integer|min:0',
            'counterfeit_items' => 'required|integer|min:0',
            'observations' => 'nullable|string',
            'recommendations' => 'nullable|string',
            'offence_declared' => 'boolean',
            'offence_description' => 'nullable|string|required_if:offence_declared,true',
            'proposed_fine' => 'nullable|numeric|min:0',
            'offence_severity' => 'nullable|in:minor,moderate,severe,critical|required_if:offence_declared,true',
            'photos_paths' => 'nullable|array',
            'photos_paths.*' => 'string|max:2048',
            'documents_paths' => 'nullable|array',
            'documents_paths.*' => 'string|max:2048',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        if (($validated['compliant_items'] + $validated['non_compliant_items']) > $validated['total_items_checked']) {
            return response()->json([
                'message' => 'Compliant and non-compliant totals cannot exceed total items checked.'
            ], 422);
        }

        $status = ($validated['offence_declared'] ?? false) || ($validated['non_compliant_items'] ?? 0) > 0
            ? 'requires_followup'
            : 'completed';

        // Generate control number logic duplicated from existing controller
        // Ideally this should be in a Service class
        $lastControl = FieldControl::whereYear('created_at', now()->year)->orderBy('id', 'desc')->first();
        $nextNumber = $lastControl ? (intval(substr($lastControl->control_number, -4)) + 1) : 1;
        $controlNumber = 'FC-' . now()->year . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        $control = FieldControl::create([
            'control_number' => $controlNumber,
            'control_agent_id' => Auth::id(),
            'taxpayer_id' => $validated['taxpayer_id'],
            'business_name' => $validated['business_name'],
            'location_address' => $validated['location_address'],
            'latitude' => $validated['latitude'] ?? 0,
            'longitude' => $validated['longitude'] ?? 0,
            'control_type' => $validated['control_type'],
            'control_date' => now(),
            'total_items_checked' => $validated['total_items_checked'],
            'compliant_items' => $validated['compliant_items'],
            'non_compliant_items' => $validated['non_compliant_items'],
            'counterfeit_items' => $validated['counterfeit_items'],
            'status' => $status,
            'review_status' => 'pending_review',
            'observations' => $validated['observations'],
            'recommendations' => $validated['recommendations'],
            'photos_paths' => $validated['photos_paths'] ?? null,
            'documents_paths' => $validated['documents_paths'] ?? null,
            'offence_declared' => $validated['offence_declared'] ?? false,
            'offence_description' => $validated['offence_description'],
            'proposed_fine' => $validated['proposed_fine'],
            'offence_severity' => $validated['offence_severity'] ?? null,
            'is_synced' => true,
            'sync_date' => now(),
        ]);

        return response()->json([
            'message' => 'Inspection recorded successfully',
            'control' => $control,
        ]);
    }
}
