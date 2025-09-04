import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            dispatch(setCredentials(data));
            navigate('/profile');
        },
    });

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" component="h1" gutterBottom>
                Login
            </Typography>
            {mutation.isError && (
                <Alert severity="error">{(mutation.error as any).response?.data?.message || 'An error occurred'}</Alert>
            )}
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
                <TextField
                    {...register('email')}
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField
                    {...register('password')}
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={mutation.isPending}>
                    {mutation.isPending ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </Container>
    );
};
