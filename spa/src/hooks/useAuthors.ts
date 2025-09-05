import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:6225/api/v1',
});

export const getAuthors = async (): Promise<string[]> => {
    const { data } = await apiClient.get('/authors');
    return data;
};

export const useAuthors = () => {
    return useQuery({
        queryKey: ['authors'],
        queryFn: getAuthors,
    });
};
