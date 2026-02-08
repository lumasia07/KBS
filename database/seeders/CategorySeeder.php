<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // First, seed certificate types if they don't exist
        $certificateTypes = [
            [
                'name' => 'Health Certificate',
                'code' => 'HEALTH',
                'description' => 'Certificate verifying product safety for human consumption/use',
                'requirements' => json_encode([
                    'lab_test_results' => true,
                    'manufacturing_date_required' => true,
                    'expiry_date_required' => true,
                    'microbial_testing' => true,
                ]),
                'is_required_by_default' => true,
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Origin Certificate',
                'code' => 'ORIGIN',
                'description' => 'Certificate verifying product country of origin',
                'requirements' => json_encode([
                    'manufacturer_details' => true,
                    'production_location' => true,
                    'export_documentation' => true,
                ]),
                'is_required_by_default' => false,
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Quality Certificate',
                'code' => 'QUALITY',
                'description' => 'Certificate verifying product quality standards',
                'requirements' => json_encode([
                    'quality_standards' => true,
                    'inspection_report' => true,
                    'compliance_certification' => true,
                ]),
                'is_required_by_default' => false,
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Halal Certificate',
                'code' => 'HALAL',
                'description' => 'Certificate for Halal-compliant products',
                'requirements' => json_encode([
                    'halal_certification_body' => true,
                    'ingredient_verification' => true,
                    'processing_methods' => true,
                ]),
                'is_required_by_default' => false,
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Organic Certificate',
                'code' => 'ORGANIC',
                'description' => 'Certificate for organic products',
                'requirements' => json_encode([
                    'organic_certification_body' => true,
                    'no_synthetic_chemicals' => true,
                    'sustainable_farming' => true,
                ]),
                'is_required_by_default' => false,
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($certificateTypes as $type) {
            DB::table('certificate_types')->updateOrInsert(
                ['code' => $type['code']],
                $type
            );
        }

        // Get certificate type IDs for later use
        $healthCertId = DB::table('certificate_types')->where('code', 'HEALTH')->value('id');
        $originCertId = DB::table('certificate_types')->where('code', 'ORIGIN')->value('id');
        $qualityCertId = DB::table('certificate_types')->where('code', 'QUALITY')->value('id');
        $halalCertId = DB::table('certificate_types')->where('code', 'HALAL')->value('id');
        $organicCertId = DB::table('certificate_types')->where('code', 'ORGANIC')->value('id');

        // Now seed categories
        $categories = [
            [
                'name' => 'Beverages',
                'slug' => 'beverages',
                'description' => 'Alcoholic and non-alcoholic drinks',
                'requires_certificate' => true, // Changed from requires_health_certificate
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Cosmetics',
                'slug' => 'cosmetics',
                'description' => 'Beauty and personal care products',
                'requires_certificate' => true, // Changed from requires_health_certificate
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Food',
                'slug' => 'food',
                'description' => 'Food products and ingredients',
                'requires_certificate' => true, // Changed from requires_health_certificate
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Pharmaceuticals',
                'slug' => 'pharmaceuticals',
                'description' => 'Medicines and healthcare products',
                'requires_certificate' => true, // Changed from requires_health_certificate
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Chemicals',
                'slug' => 'chemicals',
                'description' => 'Industrial and household chemicals',
                'requires_certificate' => false, // Changed from requires_health_certificate
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Tobacco',
                'slug' => 'tobacco',
                'description' => 'Tobacco products',
                'requires_certificate' => true, // Changed from requires_health_certificate
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Other',
                'slug' => 'other',
                'description' => 'Other miscellaneous products',
                'requires_certificate' => false, // Changed from requires_health_certificate
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->updateOrInsert(
                ['slug' => $category['slug']],
                $category
            );
        }

        // Now create relationships between categories and certificate types
        $categoryCertificateRelations = [
            // Beverages require Health and may optionally require Origin, Quality, Halal
            'beverages' => [
                ['certificate_type_id' => $healthCertId, 'is_required' => true, 'specific_requirements' => 'Must include microbial testing results'],
                ['certificate_type_id' => $originCertId, 'is_required' => false, 'specific_requirements' => null],
                ['certificate_type_id' => $qualityCertId, 'is_required' => false, 'specific_requirements' => null],
                ['certificate_type_id' => $halalCertId, 'is_required' => false, 'specific_requirements' => 'For Halal beverages only'],
            ],
            // Cosmetics require Health and Quality
            'cosmetics' => [
                ['certificate_type_id' => $healthCertId, 'is_required' => true, 'specific_requirements' => 'Must include skin irritation test results'],
                ['certificate_type_id' => $qualityCertId, 'is_required' => true, 'specific_requirements' => 'Must meet ISO 22716 standards'],
                ['certificate_type_id' => $originCertId, 'is_required' => false, 'specific_requirements' => null],
            ],
            // Food requires Health and may require Halal/Organic
            'food' => [
                ['certificate_type_id' => $healthCertId, 'is_required' => true, 'specific_requirements' => 'Must include nutritional analysis and allergen information'],
                ['certificate_type_id' => $halalCertId, 'is_required' => false, 'specific_requirements' => 'Required for Halal food products'],
                ['certificate_type_id' => $organicCertId, 'is_required' => false, 'specific_requirements' => 'Required for organic food products'],
                ['certificate_type_id' => $originCertId, 'is_required' => false, 'specific_requirements' => 'For imported food products only'],
            ],
            // Pharmaceuticals require Health and Quality
            'pharmaceuticals' => [
                ['certificate_type_id' => $healthCertId, 'is_required' => true, 'specific_requirements' => 'Must include clinical trial data and side effects documentation'],
                ['certificate_type_id' => $qualityCertId, 'is_required' => true, 'specific_requirements' => 'Must meet GMP standards'],
                ['certificate_type_id' => $originCertId, 'is_required' => true, 'specific_requirements' => 'Manufacturer and country of origin must be specified'],
            ],
            // Chemicals require Quality (not Health)
            'chemicals' => [
                ['certificate_type_id' => $qualityCertId, 'is_required' => true, 'specific_requirements' => 'Must include MSDS (Material Safety Data Sheet)'],
                ['certificate_type_id' => $originCertId, 'is_required' => false, 'specific_requirements' => null],
            ],
            // Tobacco requires Health and Origin
            'tobacco' => [
                ['certificate_type_id' => $healthCertId, 'is_required' => true, 'specific_requirements' => 'Must include warning labels and nicotine content'],
                ['certificate_type_id' => $originCertId, 'is_required' => true, 'specific_requirements' => 'Country of origin must be verified'],
                ['certificate_type_id' => $qualityCertId, 'is_required' => false, 'specific_requirements' => null],
            ],
            // Other category may optionally require certificates
            'other' => [
                ['certificate_type_id' => $healthCertId, 'is_required' => false, 'specific_requirements' => 'If product has health implications'],
                ['certificate_type_id' => $qualityCertId, 'is_required' => false, 'specific_requirements' => 'If quality standards need verification'],
            ],
        ];

        foreach ($categoryCertificateRelations as $slug => $certTypes) {
            $category = DB::table('categories')->where('slug', $slug)->first();

            if ($category) {
                foreach ($certTypes as $certType) {
                    DB::table('category_certificate_type')->updateOrInsert(
                        [
                            'category_id' => $category->id,
                            'certificate_type_id' => $certType['certificate_type_id']
                        ],
                        [
                            'is_required' => $certType['is_required'],
                            'specific_requirements' => $certType['specific_requirements'],
                            'created_at' => Carbon::now(),
                            'updated_at' => Carbon::now(),
                        ]
                    );
                }
            }
        }

        $this->command->info('Categories and certificate types seeded successfully!');
        $this->command->info('Total categories: ' . DB::table('categories')->count());
        $this->command->info('Total certificate types: ' . DB::table('certificate_types')->count());
        $this->command->info('Total category-certificate relationships: ' . DB::table('category_certificate_type')->count());
    }
}