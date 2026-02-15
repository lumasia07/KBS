<?php

namespace App\Jobs;

use App\Models\Stamp;
use App\Models\StampOrder;
use App\Models\StampType;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GenerateStampsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected StampOrder $order;
    protected User $user;
    protected string $batchId;
    protected int $chunkSize = 1000;

    public $timeout = 3600; // 1 hour timeout for large batches
    public $tries = 3; // Retry up to 3 times

    /**
     * Create a new job instance.
     */
    public function __construct(StampOrder $order, User $user, string $batchId)
    {
        $this->order = $order->withoutRelations();
        $this->user = $user->withoutRelations();
        $this->batchId = $batchId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Update order status to in_production
            $this->order->update(['status' => 'in_production']);

            $stampType = $this->order->stampType;
            $totalQuantity = $this->order->quantity;
            $chunks = ceil($totalQuantity / $this->chunkSize);

            // Get the starting serial number
            $lastSerial = $this->getLastSerialNumber();
            $currentSerial = $lastSerial + 1;

            for ($chunk = 0; $chunk < $chunks; $chunk++) {
                $startIndex = $chunk * $this->chunkSize;
                $chunkQuantity = min($this->chunkSize, $totalQuantity - $startIndex);

                $stamps = [];
                $now = now();

                for ($i = 0; $i < $chunkQuantity; $i++) {
                    $serialNumber = $this->generateSerialNumber($currentSerial);
                    $qrPayload = $this->generateQrPayload($serialNumber);

                    $stamps[] = [
                        'id' => (string) Str::uuid(),
                        'serial_number' => $serialNumber,
                        'qr_code' => $qrPayload['qr_code'],
                        'order_id' => $this->order->id,
                        'taxpayer_id' => $this->order->taxpayer_id,
                        'product_id' => $this->order->product_id,
                        'stamp_type_id' => $this->order->stamp_type_id,
                        'status' => 'produced',
                        'production_date' => $now,
                        'production_batch' => $this->batchId,
                        'produced_by' => $this->user->id,
                        'encryption_key' => $qrPayload['encryption_key'],
                        'digital_signature' => $qrPayload['digital_signature'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    $currentSerial++;
                }

                // Bulk insert the chunk
                DB::table('stamps')->insert($stamps);

                // Update progress in cache
                $this->updateProgress($chunk + 1, $chunks);
            }

            // Update order status to produced
            $this->order->update([
                'status' => 'produced',
                'actual_delivery_date' => now(),
            ]);

            // Log success
            Log::info('Stamps generated successfully', [
                'order_id' => $this->order->id,
                'batch_id' => $this->batchId,
                'quantity' => $totalQuantity
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to generate stamps', [
                'order_id' => $this->order->id,
                'error' => $e->getMessage()
            ]);

            // Update order status to failed
            $this->order->update(['status' => 'production_failed']);

            throw $e;
        }
    }

    /**
     * Get the last serial number from the database with locking
     */
    protected function getLastSerialNumber(): int
    {
        // Use database lock to prevent race conditions
        return DB::transaction(function () {
            // Lock the stamps table for the serial number sequence
            $lastStamp = Stamp::whereYear('created_at', date('Y'))
                ->orderBy('serial_number', 'desc')
                ->lockForUpdate()
                ->first();

            if (!$lastStamp) {
                return 0;
            }

            // Extract the numeric part from serial number (e.g., KBS-2026-000001 -> 1)
            preg_match('/-(\d+)$/', $lastStamp->serial_number, $matches);
            return isset($matches[1]) ? (int) $matches[1] : 0;
        });
    }

    /**
     * Generate a sequential serial number
     */
    protected function generateSerialNumber(int $sequence): string
    {
        $year = date('Y');
        return sprintf('KBS-%s-%06d', $year, $sequence);
    }

    /**
     * Generate a QR payload with encryption and digital signature
     */
    protected function generateQrPayload(string $serialNumber): array
    {
        // Generate a unique encryption key for this stamp
        $encryptionKey = hash('sha256', $serialNumber . Str::random(32) . config('app.key'));

        // Create QR payload with essential verification data
        $payload = [
            'sn' => $serialNumber,
            'ts' => time(),
            'uid' => Str::uuid()->toString(),
            'ek' => substr($encryptionKey, 0, 16), // First 16 chars for encryption
        ];

        // Generate digital signature
        $signature = hash_hmac('sha256', json_encode($payload), config('app.key'));

        // Create final QR code data (base64 encoded for compact storage)
        $qrData = [
            'p' => base64_encode(json_encode($payload)),
            'sig' => $signature,
        ];

        return [
            'qr_code' => json_encode($qrData),
            'encryption_key' => $encryptionKey,
            'digital_signature' => $signature,
        ];
    }

    /**
     * Update progress in cache for UI feedback
     */
    protected function updateProgress(int $completedChunks, int $totalChunks): void
    {
        $progress = round(($completedChunks / $totalChunks) * 100);

        Cache::put(
            "stamp_generation_progress_{$this->batchId}",
            [
                'progress' => $progress,
                'completed_chunks' => $completedChunks,
                'total_chunks' => $totalChunks,
                'updated_at' => now()
            ],
            now()->addHours(2)
        );
    }

    /**
     * Handle job failure
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('GenerateStampsJob failed', [
            'order_id' => $this->order->id,
            'batch_id' => $this->batchId,
            'error' => $exception->getMessage()
        ]);

        // Clear progress from cache
        Cache::forget("stamp_generation_progress_{$this->batchId}");
    }
}