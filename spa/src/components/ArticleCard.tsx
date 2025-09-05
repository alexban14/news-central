import { Article } from '../api';
import { Card, CardContent, CardMedia, Typography, Link } from '@mui/material';

interface ArticleCardProps {
    article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {article.imageUrl && (
                <CardMedia
                    component="img"
                    sx={{ height: 140 }}
                    image={article.imageUrl}
                    alt={article.title}
                />
            )}
            <CardContent sx={{ flexGrow: 1, textAlign: 'left' }}>
                <Typography component="h2" variant="h6">
                    <Link href={`/articles/${article.id}`} underline="hover">
                        {article.title}
                    </Link>
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                    {new Date(article.publishedAt).toLocaleDateString()} - {article.source.name}
                </Typography>
                <Typography variant="body2" paragraph>
                    {article.summary}
                </Typography>
            </CardContent>
        </Card>
    );
};
