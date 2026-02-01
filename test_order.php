<?php

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "Starting Test...\n";
    
    $taxpayer = App\Models\Taxpayer::first();
    if (!$taxpayer) die("No Taxpayer found.\n");
    
    $product = $taxpayer->products()->first();
    // Fallback if no linked product, get any product
    if (!$product) $product = App\Models\Product::first();
    if (!$product) die("No Product found.\n");
    
    $stampType = App\Models\StampType::first();
    // Simulate fallback logic
    $stampTypeId = $stampType ? $stampType->id : 1;
    
    echo "Creating Order for Taxpayer: {$taxpayer->id}, Product: {$product->id}, Type: {$stampTypeId}\n";
    
    $order = App\Models\StampOrder::create([
        'order_number' => 'TEST-' . time(),
        'taxpayer_id' => $taxpayer->id,
        'product_id' => $product->id,
        'stamp_type_id' => $stampTypeId,
        'quantity' => 10,
        'packaging_type' => 'sheets', // Testing 'sheets'
        'unit_price' => 50.00,
        'total_amount' => 500.00,
        'tax_amount' => 80.00,
        'penalty_amount' => 0.00,
        'grand_total' => 580.00,
        'status' => 'submitted',
        'payment_method' => 'bank_transfer',
        'delivery_method' => 'pickup',
        'submitted_by' => $taxpayer->user_id ?? 15,
    ]);
    
    echo "Order Created Successfully! ID: " . $order->id . "\n";
    
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
