<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * Seeder aligned with Provincial Decree N°SC/0208/CAB/GVK/DBL/2025
 * on the Categorization of Packaged Products and Marking Standards.
 */
class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // ──────────────────────────────────────────────
        // 1. Certificate Types
        // ──────────────────────────────────────────────
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
                'created_at' => $now,
                'updated_at' => $now,
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
                'created_at' => $now,
                'updated_at' => $now,
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
                'created_at' => $now,
                'updated_at' => $now,
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
                'created_at' => $now,
                'updated_at' => $now,
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
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Safety Data Sheet',
                'code' => 'SDS',
                'description' => 'Material Safety Data Sheet (MSDS/SDS) for chemical and hazardous products',
                'requirements' => json_encode([
                    'chemical_composition' => true,
                    'hazard_classification' => true,
                    'handling_precautions' => true,
                    'first_aid_measures' => true,
                ]),
                'is_required_by_default' => false,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'CE Conformity',
                'code' => 'CE',
                'description' => 'European Conformity marking for electronics, appliances and construction materials',
                'requirements' => json_encode([
                    'conformity_declaration' => true,
                    'technical_documentation' => true,
                    'notified_body_certificate' => false,
                ]),
                'is_required_by_default' => false,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'GMP Certificate',
                'code' => 'GMP',
                'description' => 'Good Manufacturing Practice certificate for pharmaceuticals and cosmetics',
                'requirements' => json_encode([
                    'manufacturing_audit' => true,
                    'facility_inspection' => true,
                    'process_validation' => true,
                ]),
                'is_required_by_default' => false,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        foreach ($certificateTypes as $type) {
            DB::table('certificate_types')->updateOrInsert(
                ['code' => $type['code']],
                $type
            );
        }

        $certIds = DB::table('certificate_types')
            ->pluck('id', 'code')
            ->toArray();

        // ──────────────────────────────────────────────
        // 2. Top-level Categories (Decree Annex I–XVII)
        // ──────────────────────────────────────────────
        $foodStandards = ['Codex', 'ISO 22000', 'ISO/TS 22005', 'GS1', 'CE', 'ISO', 'HACCP'];
        $petroStandards = ['API', 'ASTM', 'D975', 'ISO 8217', 'REACH', 'GHS', 'ATEX/IECEX', 'ISO 9001'];
        $electroStandards = ['IEC 62941', 'ISO/IEC 15408', 'GS1 SGTIN', 'CE', 'ATEX'];
        $textileStandards = ['ISO 1833', 'ISO 3758', 'GS1', 'CE', 'ISO 9001'];
        $constructStandards = ['ISO 9001', 'EN 197-1', 'CE'];
        $luxuryStandards = ['GS1 Digital Link', 'CE', 'ISO 22716', 'ISO 9001'];
        $parcelStandards = ['ISO 11607', 'ISO 15378', 'ISO 18601'];
        $tobaccoStandards = ['CE', 'ISO'];
        $cosmeticStandards = ['ISO 22716', 'ISO 16128'];
        $pharmaStandards = ['ISO 13485', 'GMP', 'ISO/IEC 15459', 'ISO 9001', '21 CFR Part 11'];
        $chemicalStandards = ['ISO 11014', 'CLPP', 'REACH', 'ASTM D4169'];
        $surfactantStandards = ['ISO 9001', 'REACH', 'GHS'];
        $transportStandards = ['ISO 9001', 'ECE R30', 'ECE R54'];

        $topCategories = [
            // I. Local Agro-Food Products
            [
                'name' => 'Local Agro-Food Products',
                'slug' => 'local-agro-food',
                'decree_reference' => 'I',
                'description' => 'Locally produced agro-food products and assimilated (industrial & artisanal)',
                'origin_type' => 'local',
                'production_type' => null,
                'applicable_standards' => $foodStandards,
                'requires_certificate' => true,
                'sort_order' => 1
            ],

            // II. Imported Agro-Food Products
            [
                'name' => 'Imported Agro-Food Products',
                'slug' => 'imported-agro-food',
                'decree_reference' => 'II',
                'description' => 'Imported agro-food products and assimilated',
                'origin_type' => 'imported',
                'production_type' => null,
                'applicable_standards' => $foodStandards,
                'requires_certificate' => true,
                'sort_order' => 2
            ],

            // III. Local Industrial Beverages
            [
                'name' => 'Local Industrial Beverages',
                'slug' => 'local-industrial-beverages',
                'decree_reference' => 'III',
                'description' => 'Locally produced industrial beverages and assimilated',
                'origin_type' => 'local',
                'production_type' => 'industrial',
                'applicable_standards' => $foodStandards,
                'requires_certificate' => true,
                'sort_order' => 3
            ],

            // IV. Local Artisanal Beverages & Food Liquids
            [
                'name' => 'Local Artisanal Beverages',
                'slug' => 'local-artisanal-beverages',
                'decree_reference' => 'IV',
                'description' => 'Locally produced artisanal beverages and food liquids',
                'origin_type' => 'local',
                'production_type' => 'artisanal',
                'applicable_standards' => $foodStandards,
                'requires_certificate' => true,
                'sort_order' => 4
            ],

            // V. Imported Beverages
            [
                'name' => 'Imported Beverages',
                'slug' => 'imported-beverages',
                'decree_reference' => 'V',
                'description' => 'Imported beverages and assimilated',
                'origin_type' => 'imported',
                'production_type' => null,
                'applicable_standards' => $foodStandards,
                'requires_certificate' => true,
                'sort_order' => 5
            ],

            // VI. Petroleum Products
            [
                'name' => 'Petroleum Products',
                'slug' => 'petroleum-products',
                'decree_reference' => 'VI',
                'description' => 'Petroleum products and assimilated (chemical, colorimetric and electronic marking)',
                'origin_type' => null,
                'production_type' => null,
                'applicable_standards' => $petroStandards,
                'requires_certificate' => true,
                'sort_order' => 6
            ],

            // VII. Electronics & Household Appliances
            [
                'name' => 'Electronics & Household Appliances',
                'slug' => 'electronics-appliances',
                'decree_reference' => 'VII',
                'description' => 'Electronic products, household appliances and assimilated',
                'origin_type' => null,
                'production_type' => null,
                'applicable_standards' => $electroStandards,
                'requires_certificate' => true,
                'sort_order' => 7
            ],

            // VIII. Textile Products
            [
                'name' => 'Textile Products',
                'slug' => 'textile-products',
                'decree_reference' => 'VIII',
                'description' => 'Textile products and assimilated',
                'origin_type' => null,
                'production_type' => null,
                'applicable_standards' => $textileStandards,
                'requires_certificate' => false,
                'sort_order' => 8
            ],

            // IX. Construction Materials
            [
                'name' => 'Construction Materials',
                'slug' => 'construction-materials',
                'decree_reference' => 'IX',
                'description' => 'Construction materials and assimilated',
                'origin_type' => null,
                'production_type' => null,
                'applicable_standards' => $constructStandards,
                'requires_certificate' => true,
                'sort_order' => 9
            ],

            // X. Luxury Products
            [
                'name' => 'Luxury Products',
                'slug' => 'luxury-products',
                'decree_reference' => 'X',
                'description' => 'Luxury products and assimilated (jewelry, watches, perfumes, premium alcohols)',
                'origin_type' => null,
                'production_type' => null,
                'applicable_standards' => $luxuryStandards,
                'requires_certificate' => true,
                'sort_order' => 10
            ],

            // XI. Industrial & Commercial Parcels
            [
                'name' => 'Industrial & Commercial Parcels',
                'slug' => 'industrial-commercial-parcels',
                'decree_reference' => 'XI',
                'description' => 'Industrial and commercial parcels and assimilated',
                'origin_type' => null,
                'production_type' => null,
                'applicable_standards' => $parcelStandards,
                'requires_certificate' => false,
                'sort_order' => 11
            ],

            // XII. Tobacco & Cigarettes
            [
                'name' => 'Tobacco & Cigarettes',
                'slug' => 'tobacco',
                'decree_reference' => 'XII',
                'description' => 'Tobacco products, cigarettes, e-liquids and heated tobacco',
                'origin_type' => null,
                'production_type' => null,
                'applicable_standards' => $tobaccoStandards,
                'requires_certificate' => true,
                'sort_order' => 12
            ],

            // XIII. Cosmetic Products
            [
                'name' => 'Cosmetic Products',
                'slug' => 'cosmetics',
                'decree_reference' => 'XIII',
                'description' => 'Cosmetic products including skin care, makeup, hair care, personal hygiene',
                'origin_type' => null,
                'production_type' => null,
                'applicable_standards' => $cosmeticStandards,
                'requires_certificate' => true,
                'sort_order' => 13
            ],

            // XIV. Pharmaceutical Products
            [
                'name' => 'Pharmaceutical Products',
                'slug' => 'pharmaceuticals',
                'decree_reference' => 'XIV',
                'description' => 'Medicines, biological products, vitamins, veterinary products',
                'origin_type' => null,
                'production_type' => null,
                'applicable_standards' => $pharmaStandards,
                'requires_certificate' => true,
                'sort_order' => 14
            ],

            // XV. Chemical Products
            [
                'name' => 'Chemical Products',
                'slug' => 'chemicals',
                'decree_reference' => 'XV',
                'description' => 'Industrial, agricultural, domestic, pharmaceutical, cosmetic and laboratory chemicals',
                'origin_type' => null,
                'production_type' => null,
                'applicable_standards' => $chemicalStandards,
                'requires_certificate' => true,
                'sort_order' => 15
            ],

            // XVI. Surfactants (Agents de Surface)
            [
                'name' => 'Surfactants',
                'slug' => 'surfactants',
                'decree_reference' => 'XVI',
                'description' => 'Surfactants, solvents, complexing agents, abrasives, disinfectants',
                'origin_type' => null,
                'production_type' => null,
                'applicable_standards' => $surfactantStandards,
                'requires_certificate' => true,
                'sort_order' => 16
            ],

            // XVII. Transport & Pneumatic Products
            [
                'name' => 'Transport & Pneumatic Products',
                'slug' => 'transport-pneumatics',
                'decree_reference' => 'XVII',
                'description' => 'Spare parts, car accessories, lubricants, tires, inflation equipment',
                'origin_type' => null,
                'production_type' => null,
                'applicable_standards' => $transportStandards,
                'requires_certificate' => true,
                'sort_order' => 17
            ],
        ];

        // Upsert top-level categories
        foreach ($topCategories as $cat) {
            DB::table('categories')->updateOrInsert(
                ['slug' => $cat['slug']],
                array_merge($cat, [
                    'parent_id' => null,
                    'applicable_standards' => json_encode($cat['applicable_standards']),
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])
            );
        }

        // Helper to get a parent category id
        $parentId = fn(string $slug) => DB::table('categories')->where('slug', $slug)->value('id');

        // ──────────────────────────────────────────────
        // 3. Sub-categories per decree section
        // ──────────────────────────────────────────────
        $subCategories = [
            // I. Local Agro-Food — Industrial
            ['parent' => 'local-agro-food', 'name' => 'Processed Cereal Products (Local)', 'slug' => 'local-cereal-industrial', 'production_type' => 'industrial'],
            ['parent' => 'local-agro-food', 'name' => 'Baking Products (Local)', 'slug' => 'local-baking-industrial', 'production_type' => 'industrial'],
            ['parent' => 'local-agro-food', 'name' => 'Industrial Dairy Products (Local)', 'slug' => 'local-dairy-industrial', 'production_type' => 'industrial'],
            ['parent' => 'local-agro-food', 'name' => 'Processed Meat Products (Local)', 'slug' => 'local-meat-industrial', 'production_type' => 'industrial'],
            ['parent' => 'local-agro-food', 'name' => 'Processed Seafood Products (Local)', 'slug' => 'local-seafood-industrial', 'production_type' => 'industrial'],
            ['parent' => 'local-agro-food', 'name' => 'Sweet Products (Local Industrial)', 'slug' => 'local-sweet-industrial', 'production_type' => 'industrial'],
            ['parent' => 'local-agro-food', 'name' => 'Savory Groceries (Local)', 'slug' => 'local-savory-industrial', 'production_type' => 'industrial'],
            ['parent' => 'local-agro-food', 'name' => 'Frozen Products (Local)', 'slug' => 'local-frozen-industrial', 'production_type' => 'industrial'],
            ['parent' => 'local-agro-food', 'name' => 'Baby Products (Local)', 'slug' => 'local-baby-industrial', 'production_type' => 'industrial'],
            ['parent' => 'local-agro-food', 'name' => 'Dietetic & Nutritional Products (Local)', 'slug' => 'local-dietetic-industrial', 'production_type' => 'industrial'],
            // I. Local Agro-Food — Artisanal
            ['parent' => 'local-agro-food', 'name' => 'Artisanal Cereal Processing', 'slug' => 'local-cereal-artisanal', 'production_type' => 'artisanal'],
            ['parent' => 'local-agro-food', 'name' => 'Artisanal Dairy Products', 'slug' => 'local-dairy-artisanal', 'production_type' => 'artisanal'],
            ['parent' => 'local-agro-food', 'name' => 'Artisanal Baking & Pastry', 'slug' => 'local-baking-artisanal', 'production_type' => 'artisanal'],
            ['parent' => 'local-agro-food', 'name' => 'Artisanal Sweet Products & Jams', 'slug' => 'local-sweet-artisanal', 'production_type' => 'artisanal'],
            ['parent' => 'local-agro-food', 'name' => 'Artisanal Animal Origin Products', 'slug' => 'local-animal-artisanal', 'production_type' => 'artisanal'],
            ['parent' => 'local-agro-food', 'name' => 'Artisanal Vegetable Oils', 'slug' => 'local-oils-artisanal', 'production_type' => 'artisanal'],
            ['parent' => 'local-agro-food', 'name' => 'Processed Fruits & Vegetables (Artisanal)', 'slug' => 'local-fruits-artisanal', 'production_type' => 'artisanal'],
            ['parent' => 'local-agro-food', 'name' => 'Condiments & Seasonings (Local)', 'slug' => 'local-condiments-artisanal', 'production_type' => 'artisanal'],

            // II. Imported Agro-Food Products
            ['parent' => 'imported-agro-food', 'name' => 'Processed Cereal Products (Imported)', 'slug' => 'imported-cereal'],
            ['parent' => 'imported-agro-food', 'name' => 'Baking Products (Imported)', 'slug' => 'imported-baking'],
            ['parent' => 'imported-agro-food', 'name' => 'Dairy Products (Imported)', 'slug' => 'imported-dairy'],
            ['parent' => 'imported-agro-food', 'name' => 'Processed Meat Products (Imported)', 'slug' => 'imported-meat'],
            ['parent' => 'imported-agro-food', 'name' => 'Processed Seafood Products (Imported)', 'slug' => 'imported-seafood'],
            ['parent' => 'imported-agro-food', 'name' => 'Sweet Products & Jams (Imported)', 'slug' => 'imported-sweet'],
            ['parent' => 'imported-agro-food', 'name' => 'Processed Animal Origin Products (Imported)', 'slug' => 'imported-animal'],
            ['parent' => 'imported-agro-food', 'name' => 'Vegetable Oils (Imported)', 'slug' => 'imported-oils'],
            ['parent' => 'imported-agro-food', 'name' => 'Savory Groceries (Imported)', 'slug' => 'imported-savory'],
            ['parent' => 'imported-agro-food', 'name' => 'Frozen Products (Imported)', 'slug' => 'imported-frozen'],
            ['parent' => 'imported-agro-food', 'name' => 'Baby Products (Imported)', 'slug' => 'imported-baby'],
            ['parent' => 'imported-agro-food', 'name' => 'Dietetic & Nutritional Products (Imported)', 'slug' => 'imported-dietetic'],
            ['parent' => 'imported-agro-food', 'name' => 'Processed Fruits & Vegetables (Imported)', 'slug' => 'imported-fruits'],
            ['parent' => 'imported-agro-food', 'name' => 'Condiments & Seasonings (Imported)', 'slug' => 'imported-condiments'],

            // III. Local Industrial Beverages
            ['parent' => 'local-industrial-beverages', 'name' => 'Bottled Local Fruit Juices', 'slug' => 'local-fruit-juices'],
            ['parent' => 'local-industrial-beverages', 'name' => 'Local Sodas & Carbonated Drinks', 'slug' => 'local-sodas'],
            ['parent' => 'local-industrial-beverages', 'name' => 'Mineral & Spring Waters', 'slug' => 'local-mineral-water'],
            ['parent' => 'local-industrial-beverages', 'name' => 'Energy & Isotonic Drinks', 'slug' => 'local-energy-drinks'],
            ['parent' => 'local-industrial-beverages', 'name' => 'Non-Alcoholic Malted Beverages', 'slug' => 'local-malted-beverages'],
            ['parent' => 'local-industrial-beverages', 'name' => 'Local Beers', 'slug' => 'local-beers'],
            ['parent' => 'local-industrial-beverages', 'name' => 'Industrialized Palm or Cane Wines', 'slug' => 'local-palm-cane-wines'],
            ['parent' => 'local-industrial-beverages', 'name' => 'Locally Distilled Spirits & Liqueurs', 'slug' => 'local-spirits-liqueurs'],

            // IV. Local Artisanal Beverages — Non-alcoholic
            ['parent' => 'local-artisanal-beverages', 'name' => 'Traditional Juices', 'slug' => 'artisanal-traditional-juices'],
            ['parent' => 'local-artisanal-beverages', 'name' => 'Fermented Liquid Porridges', 'slug' => 'artisanal-fermented-porridges'],
            ['parent' => 'local-artisanal-beverages', 'name' => 'Local Infusions & Herbal Teas', 'slug' => 'artisanal-infusions'],
            ['parent' => 'local-artisanal-beverages', 'name' => 'Fermented Milk Drinks', 'slug' => 'artisanal-fermented-milk'],
            // IV. Local Artisanal Beverages — Alcoholic
            ['parent' => 'local-artisanal-beverages', 'name' => 'Palm Wine', 'slug' => 'artisanal-palm-wine'],
            ['parent' => 'local-artisanal-beverages', 'name' => 'Cane Wine', 'slug' => 'artisanal-cane-wine'],
            ['parent' => 'local-artisanal-beverages', 'name' => 'Fruit Wines', 'slug' => 'artisanal-fruit-wines'],
            ['parent' => 'local-artisanal-beverages', 'name' => 'Artisanal Liqueurs', 'slug' => 'artisanal-liqueurs'],
            ['parent' => 'local-artisanal-beverages', 'name' => 'Infused Liqueurs', 'slug' => 'artisanal-infused-liqueurs'],

            // V. Imported Beverages
            ['parent' => 'imported-beverages', 'name' => 'Imported Juices & Mixed Drinks', 'slug' => 'imported-juices'],
            ['parent' => 'imported-beverages', 'name' => 'International Sodas', 'slug' => 'imported-sodas'],
            ['parent' => 'imported-beverages', 'name' => 'Premium Mineral Waters', 'slug' => 'imported-mineral-water'],
            ['parent' => 'imported-beverages', 'name' => 'Energy Drinks (Imported)', 'slug' => 'imported-energy-drinks'],
            ['parent' => 'imported-beverages', 'name' => 'Wines (Imported)', 'slug' => 'imported-wines'],
            ['parent' => 'imported-beverages', 'name' => 'Liqueurs, Rums, Whiskies, Vodkas, Champagnes', 'slug' => 'imported-spirits'],
            ['parent' => 'imported-beverages', 'name' => 'Imported Beers', 'slug' => 'imported-beers'],

            // VI. Petroleum Products
            ['parent' => 'petroleum-products', 'name' => 'Fuels (Gasoline, Gasoil, Kerosene)', 'slug' => 'petroleum-fuels'],
            ['parent' => 'petroleum-products', 'name' => 'Lubricants', 'slug' => 'petroleum-lubricants'],
            ['parent' => 'petroleum-products', 'name' => 'Base Oils', 'slug' => 'petroleum-base-oils'],
            ['parent' => 'petroleum-products', 'name' => 'Illuminating Kerosene', 'slug' => 'petroleum-kerosene'],
            ['parent' => 'petroleum-products', 'name' => 'Heavy Fuel Oil', 'slug' => 'petroleum-heavy-fuel'],
            ['parent' => 'petroleum-products', 'name' => 'LPG', 'slug' => 'petroleum-lpg'],
            ['parent' => 'petroleum-products', 'name' => 'Jet A1 / Aviation Kerosene', 'slug' => 'petroleum-jet-a1'],

            // VII. Electronics & Household Appliances
            ['parent' => 'electronics-appliances', 'name' => 'Phones, TVs, Radios, Players', 'slug' => 'electronics-phones-tvs'],
            ['parent' => 'electronics-appliances', 'name' => 'Computers, Tablets, Printers', 'slug' => 'electronics-computers'],
            ['parent' => 'electronics-appliances', 'name' => 'Cameras, Drones', 'slug' => 'electronics-cameras'],
            ['parent' => 'electronics-appliances', 'name' => 'Consoles, Headphones', 'slug' => 'electronics-consoles'],
            ['parent' => 'electronics-appliances', 'name' => 'Modems, Routers', 'slug' => 'electronics-modems'],
            ['parent' => 'electronics-appliances', 'name' => 'Small Appliances (Blenders, Kettles, etc.)', 'slug' => 'appliances-small'],
            ['parent' => 'electronics-appliances', 'name' => 'Major Appliances (Refrigerators, Washing Machines, etc.)', 'slug' => 'appliances-major'],
            ['parent' => 'electronics-appliances', 'name' => 'Solar Panels, Generators, Inverters', 'slug' => 'electronics-solar-generators'],
            ['parent' => 'electronics-appliances', 'name' => 'Power Tools & Medical Devices', 'slug' => 'electronics-tools-medical'],

            // VIII. Textile Products
            ['parent' => 'textile-products', 'name' => 'Clothing', 'slug' => 'textile-clothing'],
            ['parent' => 'textile-products', 'name' => 'Textile Accessories', 'slug' => 'textile-accessories'],
            ['parent' => 'textile-products', 'name' => 'Household Linens', 'slug' => 'textile-household-linens'],
            ['parent' => 'textile-products', 'name' => 'Bedding & Textile Furnishings', 'slug' => 'textile-bedding'],
            ['parent' => 'textile-products', 'name' => 'Technical Textiles', 'slug' => 'textile-technical'],

            // IX. Construction Materials
            ['parent' => 'construction-materials', 'name' => 'Structural Work Materials', 'slug' => 'construction-structural'],
            ['parent' => 'construction-materials', 'name' => 'Roofing & Cladding', 'slug' => 'construction-roofing'],
            ['parent' => 'construction-materials', 'name' => 'Finishing Work Materials', 'slug' => 'construction-finishing'],
            ['parent' => 'construction-materials', 'name' => 'Insulation & Waterproofing', 'slug' => 'construction-insulation'],
            ['parent' => 'construction-materials', 'name' => 'Carpentry & Closures', 'slug' => 'construction-carpentry'],

            // X. Luxury Products
            ['parent' => 'luxury-products', 'name' => 'Jewelry (Gold, Silver, Platinum, Precious Stones)', 'slug' => 'luxury-jewelry'],
            ['parent' => 'luxury-products', 'name' => 'Watches (Mechanical, Limited Editions)', 'slug' => 'luxury-watches'],
            ['parent' => 'luxury-products', 'name' => 'Luxury & Niche Perfumes', 'slug' => 'luxury-perfumes'],
            ['parent' => 'luxury-products', 'name' => 'Premium Alcohols (Fine Wines, Champagnes, Rare Whiskies, Cognacs)', 'slug' => 'luxury-premium-alcohols'],
            ['parent' => 'luxury-products', 'name' => 'Leather Goods, Designer Clothes, Art Objects', 'slug' => 'luxury-assimilated'],

            // XI. Industrial & Commercial Parcels
            ['parent' => 'industrial-commercial-parcels', 'name' => 'Industrial Parcels (Mechanical, Equipment, Chemicals)', 'slug' => 'parcels-industrial'],
            ['parent' => 'industrial-commercial-parcels', 'name' => 'Commercial Parcels (Clothing, Food, Consumer)', 'slug' => 'parcels-commercial'],
            ['parent' => 'industrial-commercial-parcels', 'name' => 'Assimilated (Transit, Samples, Exhibition, Temporary Imports)', 'slug' => 'parcels-assimilated'],

            // XII. Tobacco & Cigarettes
            ['parent' => 'tobacco', 'name' => 'Cigarettes', 'slug' => 'tobacco-cigarettes'],
            ['parent' => 'tobacco', 'name' => 'Rolling & Tubing Tobacco', 'slug' => 'tobacco-rolling'],
            ['parent' => 'tobacco', 'name' => 'Cigars', 'slug' => 'tobacco-cigars'],
            ['parent' => 'tobacco', 'name' => 'Pipe Tobacco', 'slug' => 'tobacco-pipe'],
            ['parent' => 'tobacco', 'name' => 'Smokeless Tobacco', 'slug' => 'tobacco-smokeless'],
            ['parent' => 'tobacco', 'name' => 'E-Liquids & Heated Tobacco', 'slug' => 'tobacco-e-liquids'],

            // XIII. Cosmetic Products
            ['parent' => 'cosmetics', 'name' => 'Skin Care', 'slug' => 'cosmetics-skin-care'],
            ['parent' => 'cosmetics', 'name' => 'Makeup', 'slug' => 'cosmetics-makeup'],
            ['parent' => 'cosmetics', 'name' => 'Hair Care', 'slug' => 'cosmetics-hair-care'],
            ['parent' => 'cosmetics', 'name' => 'Perfumes', 'slug' => 'cosmetics-perfumes'],
            ['parent' => 'cosmetics', 'name' => 'Personal Hygiene', 'slug' => 'cosmetics-hygiene'],
            ['parent' => 'cosmetics', 'name' => 'Sun Protection', 'slug' => 'cosmetics-sun-protection'],
            ['parent' => 'cosmetics', 'name' => 'Specific Care', 'slug' => 'cosmetics-specific-care'],

            // XIV. Pharmaceutical Products
            ['parent' => 'pharmaceuticals', 'name' => 'Medicines', 'slug' => 'pharma-medicines'],
            ['parent' => 'pharmaceuticals', 'name' => 'Reproductive Products', 'slug' => 'pharma-reproductive'],
            ['parent' => 'pharmaceuticals', 'name' => 'Biological Products', 'slug' => 'pharma-biological'],
            ['parent' => 'pharmaceuticals', 'name' => 'Homeopathy', 'slug' => 'pharma-homeopathy'],
            ['parent' => 'pharmaceuticals', 'name' => 'Vitamins & Supplements', 'slug' => 'pharma-vitamins'],
            ['parent' => 'pharmaceuticals', 'name' => 'Veterinary Products', 'slug' => 'pharma-veterinary'],

            // XV. Chemical Products
            ['parent' => 'chemicals', 'name' => 'Industrial Chemicals', 'slug' => 'chemicals-industrial'],
            ['parent' => 'chemicals', 'name' => 'Agricultural Chemicals', 'slug' => 'chemicals-agricultural'],
            ['parent' => 'chemicals', 'name' => 'Domestic Chemicals', 'slug' => 'chemicals-domestic'],
            ['parent' => 'chemicals', 'name' => 'Pharmaceutical Chemicals', 'slug' => 'chemicals-pharmaceutical'],
            ['parent' => 'chemicals', 'name' => 'Cosmetic Chemicals', 'slug' => 'chemicals-cosmetic'],
            ['parent' => 'chemicals', 'name' => 'Laboratory Chemicals', 'slug' => 'chemicals-laboratory'],
            ['parent' => 'chemicals', 'name' => 'Specialized Chemicals', 'slug' => 'chemicals-specialized'],

            // XVI. Surfactants
            ['parent' => 'surfactants', 'name' => 'Surfactants & Solvents', 'slug' => 'surfactants-solvents'],
            ['parent' => 'surfactants', 'name' => 'Complexing Agents & Abrasives', 'slug' => 'surfactants-abrasives'],
            ['parent' => 'surfactants', 'name' => 'Disinfectants & Additives', 'slug' => 'surfactants-disinfectants'],

            // XVII. Transport & Pneumatic Products
            ['parent' => 'transport-pneumatics', 'name' => 'Spare Parts', 'slug' => 'transport-spare-parts'],
            ['parent' => 'transport-pneumatics', 'name' => 'Car Accessories', 'slug' => 'transport-accessories'],
            ['parent' => 'transport-pneumatics', 'name' => 'Automotive Lubricants', 'slug' => 'transport-lubricants'],
            ['parent' => 'transport-pneumatics', 'name' => 'Tires (Pneumatics)', 'slug' => 'transport-tires'],
            ['parent' => 'transport-pneumatics', 'name' => 'Inflation Equipment', 'slug' => 'transport-inflation-equipment'],
        ];

        foreach ($subCategories as $sub) {
            $pid = $parentId($sub['parent']);
            $parentRow = DB::table('categories')->where('slug', $sub['parent'])->first();

            DB::table('categories')->updateOrInsert(
                ['slug' => $sub['slug']],
                [
                    'parent_id' => $pid,
                    'name' => $sub['name'],
                    'slug' => $sub['slug'],
                    'decree_reference' => $parentRow->decree_reference ?? null,
                    'description' => null,
                    'origin_type' => $parentRow->origin_type ?? null,
                    'production_type' => $sub['production_type'] ?? $parentRow->production_type ?? null,
                    'applicable_standards' => $parentRow->applicable_standards ?? null,
                    'requires_certificate' => $parentRow->requires_certificate ?? false,
                    'is_active' => true,
                    'sort_order' => 0,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        // Remove the old generic "Other" category (replaced by decree categories)
        DB::table('categories')->where('slug', 'other')->delete();
        // Remove old generic "Food" / "Beverages" that have been replaced by origin-specific categories
        DB::table('categories')->where('slug', 'food')->whereNull('parent_id')
            ->where('decree_reference', null)->delete();
        DB::table('categories')->where('slug', 'beverages')->whereNull('parent_id')
            ->where('decree_reference', null)->delete();

        // ──────────────────────────────────────────────
        // 4. Category → Certificate Type Relations
        // ──────────────────────────────────────────────
        $categoryCertificateRelations = [
            // I & II — Agro-Food (local & imported)
            'local-agro-food' => [
                ['code' => 'HEALTH', 'is_required' => true, 'specific_requirements' => 'Must include nutritional analysis, allergen information and microbial testing per Codex/ISO 22000'],
                ['code' => 'QUALITY', 'is_required' => false, 'specific_requirements' => 'HACCP compliance recommended'],
                ['code' => 'HALAL', 'is_required' => false, 'specific_requirements' => 'Required for Halal food products'],
                ['code' => 'ORGANIC', 'is_required' => false, 'specific_requirements' => 'Required for organic food products'],
            ],
            'imported-agro-food' => [
                ['code' => 'HEALTH', 'is_required' => true, 'specific_requirements' => 'Must include nutritional analysis, allergen information and microbial testing per Codex/ISO 22000'],
                ['code' => 'ORIGIN', 'is_required' => true, 'specific_requirements' => 'Country of origin, manufacturer details and export documentation required'],
                ['code' => 'QUALITY', 'is_required' => false, 'specific_requirements' => 'HACCP compliance recommended'],
                ['code' => 'HALAL', 'is_required' => false, 'specific_requirements' => 'Required for Halal food products'],
            ],

            // III & IV — Local Beverages
            'local-industrial-beverages' => [
                ['code' => 'HEALTH', 'is_required' => true, 'specific_requirements' => 'Must include microbial testing results per ISO 22000'],
                ['code' => 'QUALITY', 'is_required' => false, 'specific_requirements' => null],
                ['code' => 'HALAL', 'is_required' => false, 'specific_requirements' => 'For Halal beverages only'],
            ],
            'local-artisanal-beverages' => [
                ['code' => 'HEALTH', 'is_required' => true, 'specific_requirements' => 'Must include microbial testing results'],
                ['code' => 'QUALITY', 'is_required' => false, 'specific_requirements' => null],
            ],

            // V — Imported Beverages
            'imported-beverages' => [
                ['code' => 'HEALTH', 'is_required' => true, 'specific_requirements' => 'Must include microbial testing results'],
                ['code' => 'ORIGIN', 'is_required' => true, 'specific_requirements' => 'Country of origin and export documentation required'],
                ['code' => 'QUALITY', 'is_required' => false, 'specific_requirements' => null],
                ['code' => 'HALAL', 'is_required' => false, 'specific_requirements' => 'For Halal beverages only'],
            ],

            // VI — Petroleum Products
            'petroleum-products' => [
                ['code' => 'QUALITY', 'is_required' => true, 'specific_requirements' => 'Must meet API/ASTM D975/ISO 8217 standards'],
                ['code' => 'SDS', 'is_required' => true, 'specific_requirements' => 'REACH/GHS compliant safety data sheet required'],
            ],

            // VII — Electronics & Household Appliances
            'electronics-appliances' => [
                ['code' => 'CE', 'is_required' => true, 'specific_requirements' => 'CE conformity per IEC 62941 / ISO/IEC 15408'],
                ['code' => 'QUALITY', 'is_required' => false, 'specific_requirements' => 'GS1 SGTIN traceability recommended'],
                ['code' => 'ORIGIN', 'is_required' => false, 'specific_requirements' => null],
            ],

            // VIII — Textile Products
            'textile-products' => [
                ['code' => 'QUALITY', 'is_required' => false, 'specific_requirements' => 'ISO 1833/ISO 3758 compliance recommended'],
                ['code' => 'ORIGIN', 'is_required' => false, 'specific_requirements' => null],
            ],

            // IX — Construction Materials
            'construction-materials' => [
                ['code' => 'CE', 'is_required' => true, 'specific_requirements' => 'CE marking per EN 197-1 required'],
                ['code' => 'QUALITY', 'is_required' => true, 'specific_requirements' => 'ISO 9001 compliance required'],
            ],

            // X — Luxury Products
            'luxury-products' => [
                ['code' => 'ORIGIN', 'is_required' => true, 'specific_requirements' => 'Authenticity and provenance documentation required'],
                ['code' => 'QUALITY', 'is_required' => false, 'specific_requirements' => 'ISO 22716 for luxury cosmetics, ISO 9001 for others'],
            ],

            // XI — Industrial & Commercial Parcels
            'industrial-commercial-parcels' => [
                ['code' => 'QUALITY', 'is_required' => false, 'specific_requirements' => 'ISO 11607/ISO 15378/ISO 18601 as applicable'],
                ['code' => 'ORIGIN', 'is_required' => false, 'specific_requirements' => 'For goods in transit and temporary imports'],
            ],

            // XII — Tobacco & Cigarettes
            'tobacco' => [
                ['code' => 'HEALTH', 'is_required' => true, 'specific_requirements' => 'Must include warning labels and nicotine content'],
                ['code' => 'ORIGIN', 'is_required' => true, 'specific_requirements' => 'Country of origin must be verified'],
                ['code' => 'QUALITY', 'is_required' => false, 'specific_requirements' => null],
            ],

            // XIII — Cosmetic Products
            'cosmetics' => [
                ['code' => 'HEALTH', 'is_required' => true, 'specific_requirements' => 'Must include skin irritation test results'],
                ['code' => 'GMP', 'is_required' => true, 'specific_requirements' => 'Must meet ISO 22716 GMP standards'],
                ['code' => 'ORIGIN', 'is_required' => false, 'specific_requirements' => null],
            ],

            // XIV — Pharmaceutical Products
            'pharmaceuticals' => [
                ['code' => 'HEALTH', 'is_required' => true, 'specific_requirements' => 'Must include clinical trial data and side effects documentation'],
                ['code' => 'GMP', 'is_required' => true, 'specific_requirements' => 'Must meet GMP standards per ISO 13485'],
                ['code' => 'ORIGIN', 'is_required' => true, 'specific_requirements' => 'Manufacturer and country of origin must be specified'],
                ['code' => 'QUALITY', 'is_required' => true, 'specific_requirements' => '21 CFR Part 11 compliance for data integrity'],
            ],

            // XV — Chemical Products
            'chemicals' => [
                ['code' => 'SDS', 'is_required' => true, 'specific_requirements' => 'MSDS/SDS per ISO 11014 and REACH required'],
                ['code' => 'QUALITY', 'is_required' => true, 'specific_requirements' => 'Must comply with ASTM D4169'],
                ['code' => 'ORIGIN', 'is_required' => false, 'specific_requirements' => null],
            ],

            // XVI — Surfactants
            'surfactants' => [
                ['code' => 'SDS', 'is_required' => true, 'specific_requirements' => 'GHS-compliant safety data sheet required'],
                ['code' => 'QUALITY', 'is_required' => false, 'specific_requirements' => 'ISO 9001 recommended'],
            ],

            // XVII — Transport & Pneumatic Products
            'transport-pneumatics' => [
                ['code' => 'QUALITY', 'is_required' => true, 'specific_requirements' => 'Must meet applicable ECE/ISO standards'],
                ['code' => 'ORIGIN', 'is_required' => false, 'specific_requirements' => null],
            ],
        ];

        foreach ($categoryCertificateRelations as $slug => $certs) {
            $category = DB::table('categories')->where('slug', $slug)->first();

            if (!$category) {
                continue;
            }

            foreach ($certs as $cert) {
                $certTypeId = $certIds[$cert['code']] ?? null;
                if (!$certTypeId) {
                    continue;
                }

                DB::table('category_certificate_type')->updateOrInsert(
                    [
                        'category_id' => $category->id,
                        'certificate_type_id' => $certTypeId,
                    ],
                    [
                        'is_required' => $cert['is_required'],
                        'specific_requirements' => $cert['specific_requirements'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }
        }
    }
}