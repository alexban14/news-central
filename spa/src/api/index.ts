import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:6225/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Source {
    id: number;
    name: string;
    slug: string;
}

export interface Article {
    id: number;
    title: string;
    slug: string;
    url: string;
    summary: string;
    content?: string;
    imageUrl: string | null;
    author: string | null;
    publishedAt: string;
    source: Source;
}

export interface PaginatedArticles {
    data: Article[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export interface ArticleFilters {
    search?: string;
    date_from?: string;
    date_to?: string;
    source?: string;
    page?: number;
}

export const getArticles = async (filters: ArticleFilters): Promise<PaginatedArticles> => {
    const { data } = await apiClient.get('/articles', { params: filters });
    return data;
};

export const getArticle = async (id: string): Promise<{ data: Article }> => {
    const { data } = await apiClient.get(`/articles/${id}`);
    return data;
};

export const getSources = async (): Promise<{ data: Source[] }> => {
    const { data } = await apiClient.get('/sources');
    return data;
};
