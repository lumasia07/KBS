<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Base configurations for different payment types
     */
    private array $baseConfigs = [
        'mobile_money' => [
            'type' => 'mobile_money',
            'icon' => 'smartphone',
            'settings' => [
                'requires_phone' => true,
                'requires_reference' => true,
                'min_amount' => 100,
                'max_amount' => 5000000,
                'processing_time' => 'instant'
            ],
            'is_active' => true,
        ],
        'card' => [
            'type' => 'card',
            'icon' => 'credit-card',
            'settings' => [
                'requires_card_number' => true,
                'requires_expiry' => true,
                'requires_cvv' => true,
                'min_amount' => 100,
                'max_amount' => 10000000,
                'processing_time' => 'instant'
            ],
            'is_active' => true,
        ],
        'bank_transfer' => [
            'type' => 'bank_transfer',
            'icon' => 'landmark',
            'settings' => [
                'requires_bank_name' => true,
                'requires_account_number' => true,
                'requires_reference' => true,
                'processing_time' => '1-2 business days'
            ],
            'is_active' => true,
        ],
        'cash' => [
            'type' => 'cash',
            'icon' => 'banknote',
            'settings' => [
                'requires_receipt' => false,
                'processing_time' => 'same day'
            ],
            'is_active' => true,
        ],
    ];

    /**
     * Payment methods with their specific configurations
     */
    private array $paymentMethods = [
        // Mobile Money Methods
        [
            'code' => 'orange_money',
            'name' => 'Orange Money',
            'base_type' => 'mobile_money',
            'providers' => ['orange'],
            'sort_order' => 1,
        ],
        [
            'code' => 'airtel_money',
            'name' => 'Airtel Money',
            'base_type' => 'mobile_money',
            'providers' => ['airtel'],
            'sort_order' => 2,
        ],
        [
            'code' => 'mpesa',
            'name' => 'M-PESA',
            'base_type' => 'mobile_money',
            'providers' => ['safaricom', 'vodacom'],
            'sort_order' => 3,
        ],

        // Card Methods
        [
            'code' => 'visa',
            'name' => 'Visa',
            'base_type' => 'card',
            'providers' => ['visa', 'mastercard'],
            'sort_order' => 4,
        ],
        [
            'code' => 'mastercard',
            'name' => 'Mastercard',
            'base_type' => 'card',
            'providers' => ['visa', 'mastercard'],
            'sort_order' => 5,
        ],

        // Bank Transfer
        [
            'code' => 'bank_transfer',
            'name' => 'Bank Transfer',
            'base_type' => 'bank_transfer',
            'providers' => ['equity', 'rawbank', 'bic', 'tmb', 'other'],
            'sort_order' => 6,
        ],

        // Cash
        [
            'code' => 'cash',
            'name' => 'Cash',
            'base_type' => 'cash',
            'providers' => ['agent'],
            'sort_order' => 7,
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks temporarily
        Schema::disableForeignKeyConstraints();
        DB::table('payment_methods')->truncate();
        Schema::enableForeignKeyConstraints();

        $methods = [];

        foreach ($this->paymentMethods as $method) {
            $baseConfig = $this->baseConfigs[$method['base_type']];

            // Merge base config with specific method data
            $methods[] = [
                'code' => $method['code'],
                'name' => $method['name'],
                'type' => $baseConfig['type'],
                'icon' => $baseConfig['icon'],
                'description' => $this->generateDescription($method['name'], $baseConfig['type']),
                'providers' => json_encode($method['providers']),
                'settings' => json_encode($baseConfig['settings']),
                'is_active' => $baseConfig['is_active'],
                'sort_order' => $method['sort_order'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('payment_methods')->insert($methods);
    }

    /**
     * Generate description based on payment method name and type
     */
    private function generateDescription(string $name, string $type): string
    {
        $descriptions = [
            'mobile_money' => "Pay using $name mobile wallet",
            'card' => "Pay using $name credit or debit card",
            'bank_transfer' => 'Pay via bank transfer',
            'cash' => 'Pay with cash at authorized agents',
        ];

        return $descriptions[$type] ?? "Pay using $name";
    }
}