import { createTheme } from '@mui/material/styles';
import { blue, lightBlue, green, orange, purple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[600],
      light: blue[400],
      dark: blue[800],
      contrastText: '#fff',
    },
    secondary: {
      main: lightBlue[500],
      light: lightBlue[300],
      dark: lightBlue[700],
      contrastText: '#fff',
    },
    success: {
      main: green[600],
    },
    warning: {
      main: orange[600],
    },
    info: {
      main: purple[600],
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
