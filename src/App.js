import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import Logo from './components/Logo';
import { Box, Typography, Container } from '@mui/material';

// Create a custom theme with Outmarket brand colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5722', // Outmarket Orange
      light: '#FFEDE8',
      dark: '#E64A19',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10B981', // Emerald
      light: '#ECFDF5',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    error: {
      main: '#EF4444', // Red
      light: '#FEF2F2',
      dark: '#B91C1C',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

// Home component for the landing page
const Home = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)'
      }}
    >
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Logo />
        </Box>
        <Login />
      </Container>
    </Box>
  );
};

// PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  const { isAuthenticated } = useAuth();
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />} />
        <Route 
          path="/dashboard/*" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App; 