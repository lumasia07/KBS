<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TaxpayerProduct;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProductRequestController extends Controller
{
    /**
     * Display a listing of pending product requests.
     */
    public function index()
    {
        $requests = TaxpayerProduct::with(['taxpayer', 'product.category'])
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(function ($tp) {
                return [
                    'id' => $tp->id,
                    'taxpayer' => [
                        'id' => $tp->taxpayer->id,
                        'company_name' => $tp->taxpayer->company_name,
                        'tin' => $tp->taxpayer->tax_identification_number,
                    ],
                    'product' => [
                        'id' => $tp->product->id,
                        'code' => $tp->product->code,
                        'name' => $tp->product->name,
                        'category' => $tp->product->category?->name ?? 'Uncategorized',
                        'unit_type' => $tp->product->unit_type,
                        'stamp_price' => $tp->product->stamp_price_per_unit,
                    ],
                    'date' => $tp->created_at->format('d M Y'),
                    'certificate_path' => $tp->certificate_path ? asset('storage/' . $tp->certificate_path) : null,
                    'status' => $tp->status,
                ];
            });

        return Inertia::render('admin/products/requests', [
            'requests' => $requests
        ]);
    }

    /**
     * Approve a product request.
     */
    public function approve(Request $request, $id)
    {
        $validated = $request->validate([
            'stamp_price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($id, $validated) {
            $taxpayerProduct = TaxpayerProduct::findOrFail($id);
            
            // 1. Activate the link
            $taxpayerProduct->update([
                'status' => 'active',
                'rejection_reason' => null
            ]);

            // 2. Activate the underlying product and set price
            $product = $taxpayerProduct->product;
            if ($product) {
                $product->update([
                    'is_active' => true,
                    'stamp_price_per_unit' => $validated['stamp_price']
                ]);
            }
        });

        return redirect()->back()->with('success', 'Product request approved successfully.');
    }

    /**
     * Reject a product request.
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:255',
        ]);

        $taxpayerProduct = TaxpayerProduct::findOrFail($id);
        
        $taxpayerProduct->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason
        ]);

        return redirect()->back()->with('success', 'Product request rejected.');
    }
}
