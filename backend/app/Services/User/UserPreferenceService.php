<?php

namespace App\Services\User;

use App\Models\User;
use App\Repositories\User\UserPreferenceRepositoryInterface;

class UserPreferenceService implements UserPreferenceServiceInterface
{
    public function __construct(private readonly UserPreferenceRepositoryInterface $userPreferenceRepository)
    {
    }

    public function getPreferences(User $user): array
    {
        return $this->userPreferenceRepository->getPreferences($user);
    }

    public function updatePreferences(User $user, array $preferences): void
    {
        $this->userPreferenceRepository->updatePreferences($user, $preferences);
    }
}
