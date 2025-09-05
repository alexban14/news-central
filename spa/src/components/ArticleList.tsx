import { Article } from '../api';
import { ArticleCard } from './ArticleCard';
import { Grid } from '@mui/material';

interface ArticleListProps {
    articles: Article[];
}

export const ArticleList = ({ articles }: ArticleListProps) => {
    return (
        <Grid container spacing={3}>
            {articles.map((article) => (
                <Grid item xs={12} sm={6} md={4} key={article.id}>
                    <ArticleCard article={article} />
                </Grid>
            ))}
        </Grid>
    );
};
