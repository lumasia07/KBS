<?php

namespace App\Http\Controllers;

use App\Models\Stamp;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function verify(string $serial)
    {
        $stamp = Stamp::with(['product', 'taxpayer', 'stampType', 'order'])
            ->where('serial_number', $serial)
            ->first();

        if (! $stamp) {
            return view('verify', [
                'found'  => false,
                'result' => 'not_found',
                'stamp'  => null,
            ]);
        }

        // Determine verification result based on stamp status
        $result = match ($stamp->status) {
            'active', 'activated' => 'valid',
            'expired'             => 'expired',
            'lost', 'stolen'      => 'reported_lost',
            'revoked', 'blocked'  => 'counterfeit',
            'produced', 'printed' => 'not_activated',
            default               => 'invalid',
        };

        $isValid = $result === 'valid';

        // Update verification tracking on the stamp itself
        $stamp->increment('verification_count');
        $stamp->update(['last_verification_at' => now()]);

        return view('verify', [
            'found'  => true,
            'result' => $result,
            'valid'  => $isValid,
            'stamp'  => $stamp,
        ]);
    }
}
