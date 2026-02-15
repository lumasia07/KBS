<?php

namespace App\Services;

use App\Models\Stamp;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;

class SerialNumberService
{
    protected string $redisKey = 'stamp_serial_counter';
    protected int $cacheExpiry = 86400; // 24 hours

    /**
     * Get next serial number atomically using Redis
     */
    public function getNextSerial(string $year = null): int
    {
        $year = $year ?? date('Y');
        $key = "{$this->redisKey}:{$year}";

        // Use Redis INCR for atomic increment
        $sequence = Redis::incr($key);

        // Set expiry if this is the first increment today
        if ($sequence == 1) {
            Redis::expire($key, $this->cacheExpiry);

            // Also sync with database to ensure we don't miss any
            $this->syncWithDatabase($year);
        }

        return $sequence;
    }

    /**
     * Generate full serial number
     */
    public function generateSerialNumber(string $year = null): string
    {
        $year = $year ?? date('Y');
        $sequence = $this->getNextSerial($year);

        return sprintf('KBS-%s-%06d', $year, $sequence);
    }

    /**
     * Get current serial number without incrementing
     */
    public function getCurrentSerial(string $year = null): int
    {
        $year = $year ?? date('Y');
        $key = "{$this->redisKey}:{$year}";

        return (int) Redis::get($key) ?: 0;
    }

    /**
     * Sync Redis counter with database
     */
    protected function syncWithDatabase(string $year): void
    {
        $maxSerial = Stamp::whereYear('created_at', $year)
            ->where('serial_number', 'like', "KBS-{$year}-%")
            ->orderBy('serial_number', 'desc')
            ->value('serial_number');

        if ($maxSerial) {
            preg_match('/-(\d+)$/', $maxSerial, $matches);
            if (isset($matches[1])) {
                $key = "{$this->redisKey}:{$year}";
                Redis::set($key, (int) $matches[1]);
            }
        }
    }

    /**
     * Reset counter for testing (should not be used in production)
     */
    public function resetCounter(string $year = null): void
    {
        $year = $year ?? date('Y');
        $key = "{$this->redisKey}:{$year}";
        Redis::del($key);
    }
}