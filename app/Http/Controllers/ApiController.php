<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Throwable;
use App\Models\District;
use App\Models\Commune;
use App\Models\Quartier;
use App\Models\BusinessSector;
use App\Models\CompanySize;
use App\Models\LegalForm;
use App\Models\StampType;
use App\Models\Taxpayer;
use App\Models\Product;

class ApiController extends Controller
{
    /* ------------------------------------------------------------------
     | Response Helpers
     * ------------------------------------------------------------------ */
    private function success($data, string $message = null)
    {
        return response()->json([
            'success' => true,
            'message' => $message ?? 'Data retrieved successfully',
            'data' => $data,
            'count' => is_countable($data) ? count($data) : 1,
        ]);
    }

    private function failure(Throwable $e, string $customMessage = null)
    {
        return response()->json([
            'success' => false,
            'message' => $customMessage ?? 'An error occurred while processing your request',
            'error' => config('app.debug') ? $e->getMessage() : null,
        ], 500);
    }

    /* ------------------------------------------------------------------
     | Public API Methods
     * ------------------------------------------------------------------ */

    public function districts()
    {
        try {
            $districts = District::select(
                'id',
                'name'
            )->orderBy('name')->get();

            return $this->success($districts);
        } catch (Throwable $e) {
            return $this->failure($e, 'Failed to fetch districts');
        }
    }

    public function communes(int $districtId = null)
    {
        try {
            $query = Commune::select(
                'id',
                'district_id',
                'name'
            )->orderBy('name');

            if ($districtId) {
                $query->where('district_id', $districtId);
            }

            $communes = $query->get();

            return $this->success($communes);
        } catch (Throwable $e) {
            return $this->failure($e, 'Failed to fetch communes');
        }
    }

    public function quartiers(int $communeId = null)
    {
        try {
            $query = Quartier::select(
                'id',
                'commune_id',
                'name'
            )->orderBy('name');

            if ($communeId) {
                $query->where('commune_id', $communeId);
            }

            $quartiers = $query->get();

            return $this->success($quartiers);
        } catch (Throwable $e) {
            return $this->failure($e, 'Failed to fetch quartiers');
        }
    }

    public function businessSectors()
    {
        try {
            $sectors = BusinessSector::select(
                'id',
                'code',
                'name',
                'description',
                'tax_rate',
                'is_active'
            )->where('is_active', true)->orderBy('name')->get();

            return $this->success($sectors);
        } catch (Throwable $e) {
            return $this->failure($e, 'Failed to fetch business sectors');
        }
    }

    public function companySizes()
    {
        try {
            $sizes = CompanySize::select(
                'id',
                'category',
                'min_employees',
                'max_employees',
                'description'
            )->orderBy('min_employees')->get();

            return $this->success($sizes);
        } catch (Throwable $e) {
            return $this->failure($e, 'Failed to fetch company sizes');
        }
    }

    public function legalForms()
    {
        try {
            $forms = LegalForm::select(
                'id',
                'code',
                'name',
                'description'
            )->orderBy('name')->get();

            return $this->success($forms);
        } catch (Throwable $e) {
            return $this->failure($e, 'Failed to fetch legal forms');
        }
    }

    public function stampTypes()
    {
        try {
            $types = StampType::select(
                'id',
                'code',
                'name',
                'technology',
                'description',
                'security_features',
                'unit_cost',
                'is_active'
            )->where('is_active', true)->orderBy('name')->get();

            return $this->success($types);
        } catch (Throwable $e) {
            return $this->failure($e, 'Failed to fetch stamp types');
        }
    }

    public function taxpayers()
    {
        try {
            $taxpayers = Taxpayer::with([
                'legalForm:id,code,name',
                'sector:id,code,name,tax_rate',
                'companySize:id,category',
                'municipality:id,name'
            ])
                ->select(
                    'id',
                    'tax_identification_number',
                    'company_name',
                    'legal_form_id',
                    'sector_id',
                    'company_size_id',
                    'municipality_id',
                    'email',
                    'phone_number',
                    'registration_status',
                    'registration_date'
                )
                ->orderBy('company_name')
                ->get();

            return $this->success($taxpayers);
        } catch (Throwable $e) {
            return $this->failure($e, 'Failed to fetch taxpayers');
        }
    }

    public function products()
    {
        try {
            $products = Product::select(
                'id',
                'code',
                'name',
                'description',
                'category',
                'unit_type',
                'stamp_price_per_unit',
                'requires_health_certificate',
                'is_active'
            )
                ->where('is_active', true)
                ->orderBy('name')
                ->get();

            return $this->success($products);
        } catch (Throwable $e) {
            return $this->failure($e, 'Failed to fetch products');
        }
    }
}