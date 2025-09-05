<?php

namespace App\Repositories\User;

use App\Models\User;
use App\Models\UserPreferredAuthor;

class UserPreferenceRepository implements UserPreferenceRepositoryInterface
{
    public function getPreferences(User $user): array
    {
        return [
            'sources' => $user->preferredSources()->pluck('sources.id')->toArray(),
            'authors' => $user->preferredAuthors()->pluck('author_name')->toArray(),
        ];
    }

    public function updatePreferences(User $user, array $preferences): void
    {
        if (isset($preferences['sources'])) {
            $user->preferredSources()->sync($preferences['sources']);
        }

        if (isset($preferences['authors'])) {
            $user->preferredAuthors()->delete();
            $authors = array_map(fn($author) => ['author_name' => $author], $preferences['authors']);
            $user->preferredAuthors()->createMany($authors);
        }
    }
}
