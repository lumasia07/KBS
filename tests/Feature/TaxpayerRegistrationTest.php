<?php

namespace Tests\Feature;

use App\Models\BusinessSector;
use App\Models\Commune;
use App\Models\CompanySize;
use App\Models\District;
use App\Models\LegalForm;
use App\Models\Quartier;
use App\Models\Taxpayer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class TaxpayerRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_taxpayer_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('taxpayer.register'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('TaxpayerRegistration')
            ->has('legalForms')
            ->has('sectors')
            ->has('districts')
            ->has('communes')
            ->has('quartiers')
        );
    }

    public function test_new_taxpayer_can_register()
    {
        // Seed necessary data manually as factories might be missing
        $legalForm = LegalForm::create(['name' => 'Sole Proprietorship', 'code' => 'SP']);
        $sector = BusinessSector::create(['name' => 'Technology', 'code' => 'TECH']);
        $companySize = CompanySize::create(['category' => 'Small', 'min_employees' => 1, 'max_employees' => 10]);
        $district = District::create(['name' => 'District A']);
        $commune = Commune::create(['name' => 'Commune B', 'district_id' => $district->id]);
        $quartier = Quartier::create(['name' => 'Quartier C', 'commune_id' => $commune->id]);

        $response = $this->post(route('taxpayer.register.post'), [
            'tax_identification_number' => 'TIN123456',
            'rccm_number' => 'RCCM123456',
            'company_name' => 'Test Company',
            'email' => 'company@example.com',
            'phone_number' => '+243999999999',
            'legal_form_id' => $legalForm->id,
            'sector_id' => $sector->id,
            'company_size_id' => $companySize->id,
            'district_id' => $district->id,
            'commune_id' => $commune->id,
            'quartier_id' => $quartier->id,
            'avenue' => 'Test Avenue',
            'physical_address' => '123 Test Street',
            'legal_representative_name' => 'John Doe',
            'legal_representative_email' => 'john@example.com',
            'legal_representative_phone' => '+243123456789',
            'legal_representative_id_number' => 'ID123456',
        ]);

        if ($response->status() !== 302) {
            $response->dump();
        }

        $response->assertRedirect(route('home'));
        
        $this->assertDatabaseHas('taxpayers', [
            'tax_identification_number' => 'TIN123456',
            'company_name' => 'Test Company',
            'email' => 'company@example.com',
        ]);
    }

    public function test_registration_validation_fails_with_missing_data()
    {
        $response = $this->post(route('taxpayer.register.post'), []);

        $response->assertSessionHasErrors([
            'tax_identification_number',
            'rccm_number',
            'company_name',
            'legal_form_id',
            'sector_id',
            'district_id',
            'commune_id',
            'physical_address',
            'legal_representative_name',
            'legal_representative_email',
            'legal_representative_phone',
            'legal_representative_id_number',
        ]);
    }
}
