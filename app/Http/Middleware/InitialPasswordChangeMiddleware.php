<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class InitialPasswordChangeMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && !$user->password_changed) {
            if (
                !$request->routeIs('user-password.edit') &&
                !$request->routeIs('user-password.update')
            ) {
                return redirect()->route('user-password.edit');
            }
        }

        return $next($request);
    }
}