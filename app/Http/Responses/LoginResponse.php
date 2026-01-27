<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        $user = $request->user();
        
        // Determine the redirect URL based on user type
        $redirectUrl = $this->getRedirectUrl($user);

        return $request->wantsJson()
            ? new JsonResponse(['two_factor' => false], 200)
            : redirect()->intended($redirectUrl);
    }

    /**
     * Get the redirect URL based on user type.
     */
    protected function getRedirectUrl($user): string
    {
        if (!$user) {
            return '/dashboard';
        }

        return match ($user->user_type) {
            'admin' => '/admin/dashboard',
            'finance' => '/admin/dashboard',
            'control_agent' => '/agent/dashboard',
            'taxpayer' => '/taxpayer/dashboard',
            default => '/dashboard',
        };
    }
}
