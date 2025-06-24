<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = Auth::user();

        if (! $user) {
            return redirect('/login');
        }

        if (empty($roles) || ! in_array($user->role, $roles)) {
            // Redirect to the generic dashboard route, which will then resolve to the correct one
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
