<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Allowed ENUMs:
        // category: ['beverages', 'cosmetics', 'food', 'pharmaceuticals', 'chemicals', 'tobacco', 'other']
        // unit_type: ['unit', 'pack', 'carton', 'liter', 'kilogram', 'other']

        $catalog = [
            'beverages' => [
                ['code' => 'ALC-001', 'name' => 'Local Beer (650ml)', 'unit_type' => 'unit', 'price' => 50, 'cert' => true, 'desc' => 'Alcoholic Beverage'],
                ['code' => 'ALC-002', 'name' => 'Imported Beer (330ml)', 'unit_type' => 'unit', 'price' => 100, 'cert' => true, 'desc' => 'Alcoholic Beverage'],
                ['code' => 'ALC-003', 'name' => 'Red Wine (750ml)', 'unit_type' => 'unit', 'price' => 150, 'cert' => true, 'desc' => 'Alcoholic Beverage'],
                ['code' => 'NAB-001', 'name' => 'Mineral Water (500ml)', 'unit_type' => 'unit', 'price' => 25, 'cert' => true, 'desc' => 'Non-Alcoholic Beverage'],
                ['code' => 'NAB-002', 'name' => 'Fruit Juice (1L)', 'unit_type' => 'carton', 'price' => 75, 'cert' => true, 'desc' => 'Non-Alcoholic Beverage'],
                ['code' => 'NAB-003', 'name' => 'Soda (330ml)', 'unit_type' => 'unit', 'price' => 50, 'cert' => true, 'desc' => 'Carbonated Drink'],
            ],
            'tobacco' => [
                ['code' => 'TOB-001', 'name' => 'Cigarettes (Pack of 20)', 'unit_type' => 'pack', 'price' => 200, 'cert' => false, 'desc' => 'Tobacco Product'],
                ['code' => 'TOB-002', 'name' => 'Cigars (Single)', 'unit_type' => 'unit', 'price' => 500, 'cert' => false, 'desc' => 'Tobacco Product'],
            ],
            'other' => [ // Mapping Construction/Electrical to 'other'
                ['code' => 'CON-001', 'name' => 'Portland Cement (50kg)', 'unit_type' => 'kilogram', 'price' => 50, 'cert' => false, 'desc' => 'Construction Material'],
                ['code' => 'CON-002', 'name' => 'Electric Cable (2.5mm)', 'unit_type' => 'unit', 'price' => 200, 'cert' => false, 'desc' => 'Electrical Material'],
                ['code' => 'AUT-001', 'name' => 'Motor Oil (1L)', 'unit_type' => 'liter', 'price' => 150, 'cert' => false, 'desc' => 'Automotive Lubricant'],
            ],
            'pharmaceuticals' => [
                ['code' => 'PHA-001', 'name' => 'Painkillers / Analgesics', 'unit_type' => 'pack', 'price' => 10, 'cert' => true, 'desc' => 'Medicine'],
                ['code' => 'PHA-002', 'name' => 'Antibiotics', 'unit_type' => 'pack', 'price' => 10, 'cert' => true, 'desc' => 'Medicine'],
            ],
            'cosmetics' => [
                ['code' => 'COS-001', 'name' => 'Toilet Soap', 'unit_type' => 'unit', 'price' => 15, 'cert' => true, 'desc' => 'Hygiene'],
                ['code' => 'COS-002', 'name' => 'Body Lotion (250ml)', 'unit_type' => 'unit', 'price' => 25, 'cert' => true, 'desc' => 'Skincare'],
                ['code' => 'COS-003', 'name' => 'Perfume / Cologne', 'unit_type' => 'unit', 'price' => 100, 'cert' => true, 'desc' => 'Fragrance'],
            ],
            'food' => [
                ['code' => 'FGR-001', 'name' => 'Wheat Flour (25kg)', 'unit_type' => 'kilogram', 'price' => 50, 'cert' => true, 'desc' => 'Grains & Flour'],
                ['code' => 'FGR-002', 'name' => 'Rice (25kg)', 'unit_type' => 'kilogram', 'price' => 50, 'cert' => true, 'desc' => 'Grains'],
            ],
            'chemicals' => [
                ['code' => 'CHM-001', 'name' => 'Industrial Cleaner', 'unit_type' => 'liter', 'price' => 80, 'cert' => false, 'desc' => 'Cleaning Agent'], // Added chemicals example
            ],
        ];

        foreach ($catalog as $category => $items) {
            foreach ($items as $item) {
                Product::updateOrCreate(
                    ['code' => $item['code']], 
                    [
                        'name' => $item['name'],
                        'category' => $category, // Must match ENUM
                        'unit_type' => $item['unit_type'], // Must match ENUM
                        'stamp_price_per_unit' => $item['price'],
                        'requires_health_certificate' => $item['cert'],
                        'description' => $item['desc'],
                        'is_active' => true,
                    ]
                );
            }
        }

        $this->command->info('✅ valid Product Catalogue (ENUM compliant) seeded successfully!');
    }
}
