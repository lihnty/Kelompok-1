<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckActiveAcademicYear
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!activeAcademicYear()) {
            if (auth()->user()->hasRole('Admin')) {
                flashMessage('Tidak ada tahun ajaran yang aktif. Silahkan tambahkan terlebih dahulu.', 'warning');
                return to_route('admin.academic-years.index');
            } else if (auth()->user()->hasRole('Operator')) {
                flashMessage('Tidak ada tahun ajaran yang aktif. Harap hubungi admin.', 'warning');
                return to_route('operators.dashboard');
            }
        }
        return $next($request);
    }
}