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

    /**
     * JSON API endpoint for the homepage verify widget.
     */
    public function verifyApi(string $serial)
    {
        $stamp = Stamp::with(['product', 'taxpayer', 'stampType'])
            ->where('serial_number', $serial)
            ->first();

        if (! $stamp) {
            return response()->json([
                'found'  => false,
                'result' => 'not_found',
                'stamp'  => null,
            ]);
        }

        $result = match ($stamp->status) {
            'active', 'activated' => 'valid',
            'expired'             => 'expired',
            'lost', 'stolen'      => 'reported_lost',
            'revoked', 'blocked'  => 'counterfeit',
            'produced', 'printed' => 'not_activated',
            default               => 'invalid',
        };

        $stamp->increment('verification_count');
        $stamp->update(['last_verification_at' => now()]);

        return response()->json([
            'found'  => true,
            'result' => $result,
            'valid'  => $result === 'valid',
            'stamp'  => [
                'serial_number'      => $stamp->serial_number,
                'status'             => $stamp->status,
                'verification_count' => $stamp->verification_count,
                'last_verification_at' => $stamp->last_verification_at,
                'product'            => $stamp->product ? ['name' => $stamp->product->name] : null,
                'taxpayer'           => $stamp->taxpayer ? ['company_name' => $stamp->taxpayer->company_name] : null,
                'stamp_type'         => $stamp->stampType ? ['name' => $stamp->stampType->name] : null,
                'production_date'    => $stamp->production_date,
                'expiry_date'        => $stamp->expiry_date,
            ],
        ]);
    }
}
