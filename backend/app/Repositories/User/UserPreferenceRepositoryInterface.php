<?php

namespace App\Repositories\User;

use App\Models\User;

interface UserPreferenceRepositoryInterface
{
    public function getPreferences(User $user): array;
    public function updatePreferences(User $user, array $preferences): void;
}
