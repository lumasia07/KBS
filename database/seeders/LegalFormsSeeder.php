<?php

namespace Database\Seeders;

use App\Models\LegalForm;
use Illuminate\Database\Seeder;

class LegalFormsSeeder extends Seeder
{
    public function run()
    {
        $legalForms = [
            [
                'code' => 'SARL',
                'name' => 'Société à Responsabilité Limitée',
                'description' => 'Limited Liability Company - Most common for small to medium businesses',
            ],
            [
                'code' => 'SA',
                'name' => 'Société Anonyme',
                'description' => 'Public Limited Company - For larger enterprises, requires higher capital',
            ],
            [
                'code' => 'SNC',
                'name' => 'Société en Nom Collectif',
                'description' => 'General Partnership - All partners are jointly and severally liable',
            ],
            [
                'code' => 'SCS',
                'name' => 'Société en Commandite Simple',
                'description' => 'Limited Partnership - Has both general and limited partners',
            ],
            [
                'code' => 'SCA',
                'name' => 'Société en Commandite par Actions',
                'description' => 'Partnership Limited by Shares - Hybrid between partnership and corporation',
            ],
            [
                'code' => 'SPRL',
                'name' => 'Société Privée à Responsabilité Limitée',
                'description' => 'Private Limited Liability Company - Similar to SARL',
            ],
            [
                'code' => 'ASBL',
                'name' => 'Association Sans But Lucratif',
                'description' => 'Non-Profit Association - For charitable and non-profit organizations',
            ],
            [
                'code' => 'GIE',
                'name' => 'Groupement d\'Intérêt Économique',
                'description' => 'Economic Interest Grouping - For cooperation between businesses',
            ],
            [
                'code' => 'EI',
                'name' => 'Entreprise Individuelle',
                'description' => 'Sole Proprietorship - Single owner with unlimited liability',
            ],
            [
                'code' => 'SUCC',
                'name' => 'Succession',
                'description' => 'Estate or Inheritance - Business transferred through inheritance',
            ],
            [
                'code' => 'COOP',
                'name' => 'Coopérative',
                'description' => 'Cooperative - Owned and operated by its members',
            ],
            [
                'code' => 'BANK',
                'name' => 'Banque',
                'description' => 'Bank - Financial institution under banking regulations',
            ],
            [
                'code' => 'ASSUR',
                'name' => 'Société d\'Assurance',
                'description' => 'Insurance Company - Specialized in insurance services',
            ],
            [
                'code' => 'REP',
                'name' => 'Représentation',
                'description' => 'Representation Office - Foreign company representation',
            ],
            [
                'code' => 'BRANCH',
                'name' => 'Succursale',
                'description' => 'Branch Office - Extension of foreign company',
            ],
            [
                'code' => 'PUB',
                'name' => 'Établissement Public',
                'description' => 'Public Establishment - State-owned or public service entity',
            ],
        ];

        foreach ($legalForms as $form) {
            LegalForm::create($form);
        }
    }
}