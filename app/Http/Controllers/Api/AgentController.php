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
            'control_type' => 'required|in:routine,random,follow_up,complaint',
            'total_items_checked' => 'required|integer|min:0',
            'compliant_items' => 'required|integer|min:0',
            'non_compliant_items' => 'required|integer|min:0',
            'counterfeit_items' => 'required|integer|min:0',
            'observations' => 'nullable|string',
            'recommendations' => 'nullable|string',
            'offence_declared' => 'boolean',
            'offence_description' => 'nullable|string',
            'proposed_fine' => 'nullable|numeric|min:0',
        ]);

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
            'control_type' => $validated['control_type'],
            'control_date' => now(),
            'total_items_checked' => $validated['total_items_checked'],
            'compliant_items' => $validated['compliant_items'],
            'non_compliant_items' => $validated['non_compliant_items'],
            'counterfeit_items' => $validated['counterfeit_items'],
            'status' => 'completed',
            'observations' => $validated['observations'],
            'recommendations' => $validated['recommendations'],
            'offence_declared' => $validated['offence_declared'] ?? false,
            'offence_description' => $validated['offence_description'],
            'proposed_fine' => $validated['proposed_fine'],
            'is_synced' => true,
            'sync_date' => now(),
        ]);

        return response()->json([
            'message' => 'Inspection recorded successfully',
            'control' => $control,
        ]);
    }
}
