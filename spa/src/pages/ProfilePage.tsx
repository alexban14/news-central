import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api';
import { Container, Typography, CircularProgress, Alert, Paper, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const ProfilePage = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile(token!),
        enabled: !!token,
    });

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 128px)',
            }}
        >
            <Container maxWidth="sm">
                <Paper sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Profile
                    </Typography>
                    <Typography variant="h6">Name: {data?.name}</Typography>
                    <Typography variant="h6">Email: {data?.email}</Typography>
                </Paper>
            </Container>
        </Box>
    );
};
