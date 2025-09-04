<?php

namespace App\Services\Auth;

use Illuminate\Http\Request;

interface AuthServiceInterface
{
    public function register(array $data): array;
    public function login(array $data): array;
    public function logout(Request $request): void;
}
