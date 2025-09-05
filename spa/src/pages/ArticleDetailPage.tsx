import { useParams } from 'react-router-dom';
import { useArticle } from '../hooks/useArticles';
import { Container, Typography, CircularProgress, Alert, Paper, Link } from '@mui/material';

export const ArticleDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, isError, error } = useArticle(id!);

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    const article = data?.data;

    return (
        <Container maxWidth="md">
            {article && (
                <Paper sx={{ p: 4, mt: 4, textAlign: 'left' }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        {article.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {new Date(article.publishedAt).toLocaleDateString()} - {article.source.name}
                    </Typography>
                    {article.author && (
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            By {article.author}
                        </Typography>
                    )}
                    {article.imageUrl && (
                        <img src={article.imageUrl} alt={article.title} style={{ maxWidth: '100%', height: 'auto', margin: '16px 0' }} />
                    )}
                    <Typography variant="body1" paragraph>
                        {article.content}
                    </Typography>
                    <Link href={article.url} target="_blank" rel="noopener">
                        Read original article
                    </Link>
                </Paper>
            )}
        </Container>
    );
};
