import { useState } from 'react';
import { useArticles } from '../hooks/useArticles';
import { ArticleFilter } from '../components/ArticleFilter';
import { ArticleList } from '../components/ArticleList';
import { Container, Typography, CircularProgress, Alert, Pagination, Box, Switch, FormControlLabel } from '@mui/material';
import { ArticleFilters } from '../api';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const ArticleListPage = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const [isPersonalized, setIsPersonalized] = useState(!!token);
    const [filters, setFilters] = useState<ArticleFilters>({});

    // Use the wrapper hook again
    const { data, isLoading, isError, error } = useArticles(filters, isPersonalized);

    const handleFilter = (newFilters: ArticleFilters) => {
        setFilters({ ...newFilters, page: 1 });
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setFilters({ ...filters, page });
    };

    const handleFeedToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPersonalized(event.target.checked);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    News Central
                </Typography>
                {token && (
                    <FormControlLabel
                        control={<Switch checked={isPersonalized} onChange={handleFeedToggle} />}
                        label="Personalized Feed"
                    />
                )}
            </Box>
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