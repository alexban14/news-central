import { Routes, Route } from 'react-router-dom';
import { ArticleListPage } from './pages/ArticleListPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';
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
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Container>
        </>
    );
}

export default App;
