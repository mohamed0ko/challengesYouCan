<?php

use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/* Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
}); */


Route::apiResource('product', ProductController::class);

Route::get('/categories', [ProductController::class, 'getCategory']);
