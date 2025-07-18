<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Permission\Middleware\RoleMiddleware as SpatieRoleMiddleware;



return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ])->alias(aliases: [
            'role' => SpatieRoleMiddleware::class,
            'checkActiveAcademicYear' => \App\Http\Middleware\CheckActiveAcademicYear::class,
            'checkFeeStudent' => \App\Http\Middleware\CheckFeeStudent::class
        ]);


        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
