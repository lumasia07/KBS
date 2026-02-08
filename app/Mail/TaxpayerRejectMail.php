<?php

namespace App\Mail;

use App\Models\Taxpayer;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TaxpayerRejectMail extends Mailable
{
    use Queueable, SerializesModels;

    public Taxpayer $taxpayer;
    public ?string $rejectionReason;
    public ?string $reapplyUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(Taxpayer $taxpayer, ?string $rejectionReason = null, ?string $reapplyUrl = null)
    {
        $this->taxpayer = $taxpayer;
        $this->rejectionReason = $rejectionReason ?? 'Your application did not meet our verification requirements.';
        $this->reapplyUrl = $reapplyUrl ?? config('app.url') . '/register';
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this
            ->subject('Application Update - Kinshasa Bureau of Standards')
            ->view('emails.taxpayer.reject-taxpayer')
            ->with([
                'taxpayer' => $this->taxpayer,
                'rejectionReason' => $this->rejectionReason,
                'reapplyUrl' => $this->reapplyUrl,
            ]);
    }
}