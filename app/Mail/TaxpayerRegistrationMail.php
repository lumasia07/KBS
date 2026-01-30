<?php

namespace App\Mail;

use App\Models\Taxpayer;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TaxpayerRegistrationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Taxpayer $taxpayer;
    public string $password;

    /**
     * Create a new message instance.
     */
    public function __construct(Taxpayer $taxpayer, string $password)
    {
        $this->taxpayer = $taxpayer;
        $this->password = $password;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this
            ->subject('Taxpayer Registration Successful')
            ->view('emails.taxpayer.registration-taxpayer')
            ->with([
                'taxpayer' => $this->taxpayer,
                'password' => $this->password,
            ]);
    }
}
