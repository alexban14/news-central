<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\User\UserPreferenceServiceInterface;
use Illuminate\Http\Request;

class UserPreferenceController extends Controller
{
    public function __construct(private readonly UserPreferenceServiceInterface $userPreferenceService)
    {
    }

    public function getPreferences(Request $request)
    {
        $preferences = $this->userPreferenceService->getPreferences($request->user());

        return response()->json($preferences);
    }

    public function updatePreferences(Request $request)
    {
        $request->validate([
            'sources' => 'sometimes|array',
            'sources.*' => 'exists:sources,id',
            'authors' => 'sometimes|array',
            'authors.*' => 'string|max:255',
        ]);

        $this->userPreferenceService->updatePreferences($request->user(), $request->all());

        return response()->json(['message' => 'Preferences updated successfully.']);
    }
}
