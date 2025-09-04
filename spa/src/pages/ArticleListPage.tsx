import { useState } from 'react';
import { useArticles } from '../hooks/useArticles';
import { ArticleFilter } from '../components/ArticleFilter';
import { ArticleList } from '../components/ArticleList';
import { Container, Typography, CircularProgress, Alert, Pagination, Box } from '@mui/material';
import { ArticleFilters } from '../api';

export const ArticleListPage = () => {
    const [filters, setFilters] = useState<ArticleFilters>({});
    const { data, isLoading, isError, error } = useArticles(filters);

    const handleFilter = (newFilters: ArticleFilters) => {
        setFilters({ ...newFilters, page: 1 });
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setFilters({ ...filters, page });
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h2" component="h1" gutterBottom>
                News Central
            </Typography>
            <ArticleFilter onFilter={handleFilter} />
            {isLoading && <CircularProgress />}
            {isError && <Alert severity="error">{(error as Error).message}</Alert>}
            {data && (
                <>
                    <ArticleList articles={data.data} />
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <Pagination
                            count={data.meta.last_page}
                            page={data.meta.current_page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </>
            )}
        </Container>
    );
};
