<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Beverages',
                'slug' => 'beverages',
                'description' => 'Alcoholic and non-alcoholic drinks',
                'requires_health_certificate' => true,
            ],
            [
                'name' => 'Cosmetics',
                'slug' => 'cosmetics',
                'description' => 'Beauty and personal care products',
                'requires_health_certificate' => true,
            ],
            [
                'name' => 'Food',
                'slug' => 'food',
                'description' => 'Food products and ingredients',
                'requires_health_certificate' => true,
            ],
            [
                'name' => 'Pharmaceuticals',
                'slug' => 'pharmaceuticals',
                'description' => 'Medicines and healthcare products',
                'requires_health_certificate' => true,
            ],
            [
                'name' => 'Chemicals',
                'slug' => 'chemicals',
                'description' => 'Industrial and household chemicals',
                'requires_health_certificate' => false,
            ],
            [
                'name' => 'Tobacco',
                'slug' => 'tobacco',
                'description' => 'Tobacco products',
                'requires_health_certificate' => true,
            ],
            [
                'name' => 'Other',
                'slug' => 'other',
                'description' => 'Other miscellaneous products',
                'requires_health_certificate' => false,
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert($category);
        }
    }
}