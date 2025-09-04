import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <AppBar component="nav">
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                >
                    <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                        News Central
                    </Link>
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
