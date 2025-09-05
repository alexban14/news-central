<?php

namespace App\Services\User;

use App\Models\User;

interface UserPreferenceServiceInterface
{
    public function getPreferences(User $user): array;
    public function updatePreferences(User $user, array $preferences): void;
}
