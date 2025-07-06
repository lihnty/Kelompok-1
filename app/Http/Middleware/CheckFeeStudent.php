<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\FeeStatus;
use App\Models\Fee;

class CheckFeeStudent
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
         if (!activeAcademicYear()) {
            flashMessage('Tahun ajaran aktif tidak ditemukan', 'warning');
            return to_route('students.fees.index');
        }

        $fee = Fee::query()
            ->where('student_id', auth()->user()->student->id)
            ->where('academic_year_id', activeAcademicYear()->id)
            ->where('semester', auth()->user()->student->semester)
            ->where('status', FeeStatus::SUCCESS->value)
            ->exists();

            if(!$fee) {
                flashMessage('Harap melakukan pembayaran uang kuliah tunggal terlebih dahulu', 'warning');
                return to_route('students.fees.index');
            }
        return $next($request);
    }
}
