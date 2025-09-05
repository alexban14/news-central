import { useQuery } from '@tanstack/react-query';
import { ArticleFilters, getGeneralArticles, getPersonalizedArticles, getArticle } from '../api';



export const useArticles = (filters: ArticleFilters, isPersonalized: boolean) => {
    return useQuery({
        queryKey: ['articles', filters, isPersonalized],
        queryFn: () => {
            if (isPersonalized) {
                return getPersonalizedArticles(filters);
            } else {
                return getGeneralArticles(filters);
            }
        },
    });
};

export const useArticle = (id: string) => {
    return useQuery({
        queryKey: ['article', id],
        queryFn: () => getArticle(id),
    });
};
