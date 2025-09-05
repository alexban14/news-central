import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, getUserPreferences, updateUserPreferences, getSources } from '../api';
import { Autocomplete, TextField, Container, Typography, CircularProgress, Alert, Paper, Box, Select, MenuItem, Chip, OutlinedInput, Button, FormControl, InputLabel } from '@mui/material';
import { useSelector } from 'react-redux';
import { useSources } from '../hooks/useSources';
import { useAuthors } from "../hooks/useAuthors.ts";
import { RootState } from '../store/store';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';

export const ProfilePage = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const queryClient = useQueryClient();

    const { data: profileData, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile(token!),
        enabled: !!token,
    });

    const { data: sourcesData } = useSources();
    const { data: authorsData, isLoading: isLoadingAuthors } = useAuthors();
    const { data: preferencesData, isLoading: isLoadingPreferences } = useQuery({
        queryKey: ['user-preferences'],
        queryFn: getUserPreferences,
        enabled: !!token,
    });

    const updatePreferencesMutation = useMutation({
        mutationFn: updateUserPreferences,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
            queryClient.invalidateQueries({ queryKey: ['articles'] });
        },
    });

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            sources: [],
            authors: [],
        }
    });

    useEffect(() => {
        if (preferencesData) {
            reset({
                sources: preferencesData.sources || [],
                authors: preferencesData.authors || [],
            });
        }
    }, [preferencesData, reset]);

    const onSubmit = (data: any) => {
        updatePreferencesMutation.mutate(data);
    };

    if (isLoadingProfile || isLoadingPreferences || isLoadingAuthors) return <CircularProgress />;

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Profile
                </Typography>
                <Typography variant="h6">Name: {profileData?.name}</Typography>
                <Typography variant="h6" sx={{ mb: 4 }}>Email: {profileData?.email}</Typography>

                <Typography variant="h5" component="h2" gutterBottom>
                    Feed Preferences
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Preferred Sources</InputLabel>
                        <Controller
                            name="sources"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    multiple
                                    input={<OutlinedInput label="Preferred Sources" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={sourcesData?.data.find(s => s.id === value)?.name} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {sourcesData?.data.map((source) => (
                                        <MenuItem key={source.id} value={source.id}>
                                            {source.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <Controller
                            name="authors"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    multiple
                                    options={authorsData || []}
                                    value={field.value}
                                    onChange={(event, newValue) => {
                                        field.onChange(newValue);
                                    }}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Preferred Authors"
                                            placeholder="Select authors"
                                        />
                                    )}
                                />
                            )}
                        />
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Save Preferences
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};
