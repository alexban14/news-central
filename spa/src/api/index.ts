import axios from 'axios';
import { store } from '../store/store';

const apiClient = axios.create({
    baseURL: 'http://localhost:6225/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Source {
    id: number;
    name: string;
    slug: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
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

export const getGeneralArticles = async (filters: ArticleFilters): Promise<PaginatedArticles> => {
    const { data } = await apiClient.get('/articles/general', { params: filters });
    return data;
};

export const getPersonalizedArticles = async (filters: ArticleFilters): Promise<PaginatedArticles> => {
    const { data } = await apiClient.get('/articles/personalized', { params: filters });
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

export const login = async (credentials: any) => {
    const { data } = await apiClient.post('/login', credentials);
    return data;
};

export const register = async (userInfo: any) => {
    const { data } = await apiClient.post('/register', userInfo);
    return data;
};

export const getProfile = async (token: string) => {
    const { data } = await apiClient.get('/user', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

export const logout = async () => {
    await apiClient.post('/logout');
};

export const getUserPreferences = async (): Promise<UserPreferences> => {
    const { data } = await apiClient.get('/user/preferences');
    return data;
};

export const updateUserPreferences = async (preferences: UserPreferences) => {
    const { data } = await apiClient.put('/user/preferences', preferences);
    return data;
};

