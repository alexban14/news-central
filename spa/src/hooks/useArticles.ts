import { useQuery } from '@tanstack/react-query';
import { getArticle, getArticles, ArticleFilters } from '../api';

export const useArticles = (filters: ArticleFilters) => {
    return useQuery({
        queryKey: ['articles', filters],
        queryFn: () => getArticles(filters),
    });
};

export const useArticle = (id: string) => {
    return useQuery({
        queryKey: ['article', id],
        queryFn: () => getArticle(id),
    });
};
