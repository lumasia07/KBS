# Backend Instructions: Sticker Production & Serialization

The goal is to implement the backend logic to generate unique, serialized `Stamp` records for approved `StampOrders`. This process must handle large quantities (e.g., 50,000+ stamps) efficiently without timing out the request.

## 1. Create a Background Job
Processing thousands of stamps synchronously will timeout. Create a job to handle this asynchronously.

```bash
php artisan make:job GenerateStampsJob
```

## 2. Implement `GenerateStampsJob` Logic
This job should accept a `StampOrder` instance and perform the following:

-   **Input**: `StampOrder $order`
-   **Process**:
    1.  Update Order Status: Set status to `in_production`.
    2.  Check Last Serial: Retrieve the last generated serial number for the current year to maintain sequence (e.g., `KBS-2026-000005`).
        -   *Recommendation*: Use Redis for atomic increments to avoid race conditions.
        -   **Prerequisite**: Ensure `predis/predis` is installed (`composer require predis/predis`) or the PHPRedis extension is active.
    3.  Loop & Generate:
        -   Generate sequential serial numbers.
        -   Generate unique QR code data (e.g., a signed JSON payload or encrypted string).
        -   Prepare `Stamp` attributes (taxpayer_id, product_id, etc.).
    4.  **Bulk Insert**: Use `Stamp::insert($batch)` with a chunk size of ~1000 records to remove N+1 query overhead. **Do not save one by one.**
    5.  Finalize:
        -   Update Order Status to `produced` (or `ready_for_delivery`).
        -   Log success/failure.

### Example Schema for `Stamp` insertion:
```php
[
    'id' => Str::uuid(),
    'order_id' => $order->id,
    'serial_number' => 'KBS-'.date('Y').'-' . str_pad($nextSequence, 8, '0', STR_PAD_LEFT),
    // secure hash of serial + secret
    'qr_code' => hash_hmac('sha256', $serial, config('app.key')), 
    'taxpayer_id' => $order->taxpayer_id,
    'product_id' => $order->product_id,
    'status' => 'produced',
    'production_date' => now(),
    'created_at' => now(),
    'updated_at' => now(),
]
```

## 3. Update `ProductionController`
Modify `app/Http/Controllers/Admin/ProductionController.php` to dispatch the job instead of returning stub data.

**Current (Stub):**
```php
public function generate(StampOrder $order) {
    // Returns fake preview data
}
```

**New Implementation:**
```php
public function generate(StampOrder $order) {
    // 1. Validate status
    if ($order->status !== 'approved') {
        return response()->json(['message' => 'Order not ready.'], 400);
    }

    // 2. Dispatch Job
    GenerateStampsJob::dispatch($order);

    // 3. Update status immediately to prevent double-clicks
    $order->update(['status' => 'queued_for_production']);

    return response()->json([
        'message' => 'Production started in background.',
        'order_id' => $order->id
    ]);
}
```

## 4. Considerations
-   **Concurrency**: Ensure serial number generation is atomic or lock the table/sequence row to prevent duplicate serials if multiple jobs run simultaneously. Redis `atomic` increment is a good solution for the sequence counter.
    -   Example: `$nextSerial = Redis::incr('stamp_serial_2026');`
-   **Memory Management**: If generating >50k records, use `lazy()` or explicit chunking logic within the job to avoid memory limits.
-   **Error Handling**: If the job fails halfway, implement a way to resume or cleanup (transaction rollback might be too large for 50k rows, so "resume from last serial" logic is safer).
