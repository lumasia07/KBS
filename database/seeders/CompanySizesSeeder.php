<?php

namespace Database\Seeders;

use App\Models\CompanySize;
use Illuminate\Database\Seeder;

class CompanySizesSeeder extends Seeder
{
    public function run()
    {
        $companySizes = [
            [
                'category' => 'Micro Enterprise',
                'min_employees' => 1,
                'max_employees' => 5,
                'description' => 'Very small business, often owner-operated with few employees',
            ],
            [
                'category' => 'Small Enterprise',
                'min_employees' => 6,
                'max_employees' => 20,
                'description' => 'Small business with limited management hierarchy',
            ],
            [
                'category' => 'Medium Enterprise',
                'min_employees' => 21,
                'max_employees' => 100,
                'description' => 'Medium-sized business with established management structure',
            ],
            [
                'category' => 'Large Enterprise',
                'min_employees' => 101,
                'max_employees' => 500,
                'description' => 'Large corporation with multiple departments and management levels',
            ],
            [
                'category' => 'Very Large Enterprise',
                'min_employees' => 501,
                'max_employees' => null,
                'description' => 'Major corporation, often multinational with complex structure',
            ],
            [
                'category' => 'Sole Proprietor',
                'min_employees' => 1,
                'max_employees' => 1,
                'description' => 'Business owned and operated by a single individual',
            ],
            [
                'category' => 'Startup',
                'min_employees' => 1,
                'max_employees' => 10,
                'description' => 'Newly established business in early growth phase',
            ],
            [
                'category' => 'Informal Sector',
                'min_employees' => 1,
                'max_employees' => 5,
                'description' => 'Unregistered or informal business activities',
            ],
        ];

        foreach ($companySizes as $size) {
            CompanySize::create($size);
        }
    }
}