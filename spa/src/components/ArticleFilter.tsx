import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSources } from '../hooks/useSources';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';

const filterSchema = z.object({
    search: z.string().optional(),
    source: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

interface ArticleFilterProps {
    onFilter: (filters: FilterFormValues) => void;
}

export const ArticleFilter = ({ onFilter }: ArticleFilterProps) => {
    const { data: sourcesData } = useSources();
    const { register, handleSubmit } = useForm<FilterFormValues>({
        resolver: zodResolver(filterSchema),
    });

    return (
        <form onSubmit={handleSubmit(onFilter)} className="mb-8">
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        {...register('search')}
                        label="Search"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Source</InputLabel>
                        <Select {...register('source')} label="Source" defaultValue="">
                            <MenuItem value=""><em>All Sources</em></MenuItem>
                            {sourcesData?.data.map((source) => (
                                <MenuItem key={source.id} value={source.slug}>
                                    {source.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Filter
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};
