<?php

namespace App\Services\Admin;

use App\Models\StampOrder;
use App\Models\User;
use App\Jobs\GenerateStampsJob;
use App\Models\Stamp;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;

class ProductionService
{
    /**
     * Start production for an order
     */
    public function startProduction(StampOrder $order, User $user): array
    {
        // Generate a unique batch ID
        $batchId = 'BATCH-' . date('Ymd') . '-' . strtoupper(uniqid());

        // Begin transaction to ensure data consistency
        DB::beginTransaction();

        try {
            // Validate order can go into production
            $this->validateOrderForProduction($order);

            // Update order status
            $order->update([
                'status' => 'production_queued',
                'approved_by' => $user->id, // Track who initiated production
            ]);

            // Dispatch the job
            GenerateStampsJob::dispatch($order, $user, $batchId)
                ->onQueue('production')
                ->delay(now()->addSeconds(5)); // Small delay to allow response

            DB::commit();

            // Generate preview data for immediate response
            $previewData = $this->generatePreviewData($order);

            return [
                'success' => true,
                'message' => 'Production batch queued successfully.',
                'batch_id' => $batchId,
                'preview_data' => $previewData,
            ];

        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Failed to start production: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Check production progress
     */
    public function getProgress(string $batchId): array
    {
        $progress = cache("stamp_generation_progress_{$batchId}");

        if (!$progress) {
            return [
                'exists' => false,
                'progress' => 0,
                'message' => 'No active production batch found with this ID.',
            ];
        }

        return [
            'exists' => true,
            'progress' => $progress['progress'],
            'completed_chunks' => $progress['completed_chunks'],
            'total_chunks' => $progress['total_chunks'],
            'updated_at' => $progress['updated_at']->diffForHumans(),
        ];
    }

    /**
     * Validate order can go into production
     */
    protected function validateOrderForProduction(StampOrder $order): void
    {
        if ($order->status !== 'approved') {
            throw new \Exception('Order must be approved to start production.');
        }

        if ($order->quantity <= 0) {
            throw new \Exception('Order quantity must be greater than zero.');
        }

        // Check if stamps already exist for this order
        if ($order->stamps()->exists()) {
            throw new \Exception('Stamps have already been generated for this order.');
        }
    }

    /**
     * Generate preview data for UI
     */
    protected function generatePreviewData(StampOrder $order): array
    {
        $lastSerial = $this->getLastSerialNumber();

        return [
            'serial_start' => sprintf('KBS-%s-%06d', date('Y'), $lastSerial + 1),
            'serial_end' => sprintf('KBS-%s-%06d', date('Y'), $lastSerial + $order->quantity),
            'quantity' => $order->quantity,
            'estimated_completion' => now()->addMinutes(ceil($order->quantity / 10000))->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Get the last serial number used
     */
    protected function getLastSerialNumber(): int
    {
        $lastStamp = Stamp::whereYear('created_at', date('Y'))
            ->orderBy('serial_number', 'desc')
            ->first();

        if (!$lastStamp) {
            return 0;
        }

        preg_match('/-(\d+)$/', $lastStamp->serial_number, $matches);
        return isset($matches[1]) ? (int) $matches[1] : 0;
    }
}