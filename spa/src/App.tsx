import { Routes, Route } from 'react-router-dom';
import { ArticleListPage } from './pages/ArticleListPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import Navbar from './components/Navbar';
import { Container } from '@mui/material';

function App() {
    return (
        <>
            <Navbar />
            <Container sx={{ mt: 4, paddingTop: '64px' }}>
                <Routes>
                    <Route path="/" element={<ArticleListPage />} />
                    <Route path="/articles/:id" element={<ArticleDetailPage />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
