<?php

namespace Database\Seeders;

use App\Models\BusinessSector;
use Illuminate\Database\Seeder;

class BusinessSectorsSeeder extends Seeder
{
    public function run()
    {
        $sectors = [
            [
                'code' => 'AGR',
                'name' => 'Agriculture & Agro-industry',
                'description' => 'Agricultural production, processing, and related services',
                'tax_rate' => 5.00,
                'is_active' => true,
            ],
            [
                'code' => 'MAN',
                'name' => 'Manufacturing',
                'description' => 'Production of goods from raw materials',
                'tax_rate' => 12.50,
                'is_active' => true,
            ],
            [
                'code' => 'CON',
                'name' => 'Construction',
                'description' => 'Building construction, civil engineering, and related activities',
                'tax_rate' => 15.00,
                'is_active' => true,
            ],
            [
                'code' => 'RET',
                'name' => 'Retail & Wholesale',
                'description' => 'Sale of goods to consumers and businesses',
                'tax_rate' => 10.00,
                'is_active' => true,
            ],
            [
                'code' => 'HOT',
                'name' => 'Hospitality & Tourism',
                'description' => 'Hotels, restaurants, travel agencies, and tourism services',
                'tax_rate' => 8.00,
                'is_active' => true,
            ],
            [
                'code' => 'TRA',
                'name' => 'Transportation & Logistics',
                'description' => 'Freight, passenger transport, and logistics services',
                'tax_rate' => 12.00,
                'is_active' => true,
            ],
            [
                'code' => 'FIN',
                'name' => 'Financial Services',
                'description' => 'Banking, insurance, microfinance, and financial intermediation',
                'tax_rate' => 18.00,
                'is_active' => true,
            ],
            [
                'code' => 'TEC',
                'name' => 'Technology & IT Services',
                'description' => 'Software development, IT consulting, and telecommunications',
                'tax_rate' => 7.50,
                'is_active' => true,
            ],
            [
                'code' => 'HEA',
                'name' => 'Healthcare',
                'description' => 'Medical services, pharmacies, and healthcare facilities',
                'tax_rate' => 8.50,
                'is_active' => true,
            ],
            [
                'code' => 'EDU',
                'name' => 'Education',
                'description' => 'Schools, training centers, and educational services',
                'tax_rate' => 6.00,
                'is_active' => true,
            ],
            [
                'code' => 'MIN',
                'name' => 'Mining & Extraction',
                'description' => 'Mineral extraction and processing',
                'tax_rate' => 30.00,
                'is_active' => true,
            ],
            [
                'code' => 'ENE',
                'name' => 'Energy & Utilities',
                'description' => 'Electricity, water, and energy production',
                'tax_rate' => 20.00,
                'is_active' => true,
            ],
            [
                'code' => 'PRO',
                'name' => 'Professional Services',
                'description' => 'Legal, accounting, consulting, and architectural services',
                'tax_rate' => 16.00,
                'is_active' => true,
            ],
            [
                'code' => 'MED',
                'name' => 'Media & Communication',
                'description' => 'Advertising, publishing, broadcasting, and public relations',
                'tax_rate' => 14.00,
                'is_active' => true,
            ],
            [
                'code' => 'REA',
                'name' => 'Real Estate',
                'description' => 'Property development, rental, and management',
                'tax_rate' => 12.00,
                'is_active' => true,
            ],
            [
                'code' => 'ART',
                'name' => 'Arts & Entertainment',
                'description' => 'Creative arts, entertainment, and cultural activities',
                'tax_rate' => 9.00,
                'is_active' => true,
            ],
            [
                'code' => 'NGO',
                'name' => 'Non-Profit Organizations',
                'description' => 'Charities, associations, and non-governmental organizations',
                'tax_rate' => 0.00,
                'is_active' => true,
            ],
            [
                'code' => 'OTH',
                'name' => 'Other Services',
                'description' => 'Other service activities not classified elsewhere',
                'tax_rate' => 10.00,
                'is_active' => true,
            ],
        ];

        foreach ($sectors as $sector) {
            BusinessSector::create($sector);
        }
    }
}