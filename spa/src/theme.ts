import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2', // A nice blue color
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

export default theme;
