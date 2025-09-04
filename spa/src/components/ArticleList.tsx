import { Article } from '../api';
import { ArticleCard } from './ArticleCard';
import { Grid } from '@mui/material';

interface ArticleListProps {
    articles: Article[];
}

export const ArticleList = ({ articles }: ArticleListProps) => {
    return (
        <Grid container spacing={2}>
            {articles.map((article) => (
                <Grid item xs={12} key={article.id}>
                    <ArticleCard article={article} />
                </Grid>
            ))}
        </Grid>
    );
};
