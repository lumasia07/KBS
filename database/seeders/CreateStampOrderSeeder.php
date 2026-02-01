<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\StampOrder;
use App\Models\Taxpayer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CreateStampOrderSeeder extends Seeder
{
    public function run()
    {
        $taxpayer = Taxpayer::first();
        $product = Product::inRandomOrder()->first();

        if (!$taxpayer || !$product) {
            $this->command->info('Please ensure Taxpayers and Products exist.');
            return;
        }

        // Create a submitted order
        StampOrder::create([
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'taxpayer_id' => $taxpayer->id,
            'product_id' => $product->id,
            'quantity' => 1000,
            'unit_price' => $product->stamp_price_per_unit ?? 50.00,
            'grand_total' => 1000 * ($product->stamp_price_per_unit ?? 50.00),
            'status' => 'submitted',
            'submitted_by' => $taxpayer->user_id, // Assuming tax user exists
            'created_at' => now(),
        ]);

        // Create a pending order
        StampOrder::create([
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'taxpayer_id' => $taxpayer->id,
            'product_id' => Product::inRandomOrder()->first()->id,
            'quantity' => 500,
            'unit_price' => 50.00,
            'grand_total' => 25000.00,
            'status' => 'pending',
            'created_at' => now()->subHours(2),
        ]);
        
        // Create a completed order
        StampOrder::create([
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'taxpayer_id' => $taxpayer->id,
            'product_id' => $product->id,
            'quantity' => 2000,
            'unit_price' => 50.00,
            'grand_total' => 100000.00,
            'status' => 'delivered',
            'created_at' => now()->subDays(2),
        ]);

        $this->command->info('Seed completed: 3 Orders created.');
    }
}
