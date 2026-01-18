<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
                // BusinessSectorsSeeder::class,
                // CompanySizesSeeder::class,
                // LegalFormsSeeder::class,
                // MunicipalitiesSeeder::class,
                // StampTypesSeeder::class,
            PermissionsSeeder::class,
            AdminUserSeeder::class,
        ]);
    }
}