import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { register as registerUser } from '../api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';

const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            dispatch(setCredentials(data));
            navigate('/profile');
        },
    });

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" component="h1" gutterBottom>
                Register
            </Typography>
            {mutation.isError && (
                <Alert severity="error">{(mutation.error as any).response?.data?.message || 'An error occurred'}</Alert>
            )}
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
                <TextField
                    {...register('name')}
                    label="Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />
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
                <TextField
                    {...register('password_confirmation')}
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    error={!!errors.password_confirmation}
                    helperText={errors.password_confirmation?.message}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={mutation.isPending}>
                    {mutation.isPending ? 'Registering...' : 'Register'}
                </Button>
            </form>
        </Container>
    );
};
