import { Article } from '../api';
import { Card, CardContent, CardMedia, Typography, Link } from '@mui/material';

interface ArticleCardProps {
    article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
    return (
        <Card sx={{ display: 'flex', mb: 2 }}>
            {article.imageUrl && (
                <CardMedia
                    component="img"
                    sx={{ width: 151 }}
                    image={article.imageUrl}
                    alt={article.title}
                />
            )}
            <CardContent sx={{ flex: 1 }}>
                <Typography component="h2" variant="h5">
                    <Link href={`/articles/${article.id}`} underline="hover">
                        {article.title}
                    </Link>
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {new Date(article.publishedAt).toLocaleDateString()} - {article.source.name}
                </Typography>
                <Typography variant="subtitle1" paragraph>
                    {article.summary}
                </Typography>
            </CardContent>
        </Card>
    );
};
