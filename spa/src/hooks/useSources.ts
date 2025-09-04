import { useQuery } from '@tanstack/react-query';
import { getSources } from '../api';

export const useSources = () => {
    return useQuery({
        queryKey: ['sources'],
        queryFn: getSources,
    });
};
