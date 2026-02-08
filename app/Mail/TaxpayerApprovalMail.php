<?php

namespace App\Mail;

use App\Models\Taxpayer;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TaxpayerApprovalMail extends Mailable
{
    use Queueable, SerializesModels;

    public Taxpayer $taxpayer;
    public ?string $loginUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(Taxpayer $taxpayer, ?string $loginUrl = null)
    {
        $this->taxpayer = $taxpayer;
        $this->loginUrl = $loginUrl ?? config('app.url') . '/login';
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this
            ->subject('Taxpayer Account Approved - Kinshasa Bureau of Standards')
            ->view('emails.taxpayer.approve-taxpayer')
            ->with([
                'taxpayer' => $this->taxpayer,
                'loginUrl' => $this->loginUrl,
            ]);
    }
}