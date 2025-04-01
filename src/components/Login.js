import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated() || await apiService.init()) {
        setSuccess('Already authenticated. Redirecting...');
        // Get user info from stored tokens if available
        const userEmail = localStorage.getItem('user_email');
        if (userEmail) {
          login({ email: userEmail }, apiService.tokens);
        } else {
          // If we don't have the email stored but tokens are valid,
          // we can still proceed with login
          login({ email: 'User' }, apiService.tokens);
        }
      }
    };
    
    checkAuth();
  }, [login]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await apiService.login(email, password);
      
      if (result.status === 'success') {
        // Store user info and tokens in auth context
        login({ email }, result.tokens);
        setSuccess('Login successful! Redirecting...');
        // Store email for future reference
        localStorage.setItem('user_email', email);
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper 
        elevation={1} 
        sx={{ 
          p: 4, 
          borderRadius: '16px', 
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(230, 230, 230, 0.7)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.07)'
          }
        }}
      >
        <Typography 
          variant="h6" 
          component="h2" 
          align="center" 
          sx={{ 
            mb: 3,
            fontWeight: 500,
            color: '#1F2937',
            letterSpacing: '-0.5px'
          }}
        >
          Sign In
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2.5, borderRadius: '8px' }}>{success}</Alert>}
        
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@company.com"
            disabled={loading}
            sx={{ 
              mb: 1.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
            size="small"
          />
          
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={loading}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
            size="small"
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="medium"
            disabled={loading}
            sx={{ 
              mt: 1, 
              py: 1,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 'none',
              position: 'relative'
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ 
                  color: 'white', 
                  position: 'absolute',
                  left: 'calc(50% - 10px)'
                }} />
                <span style={{ visibility: 'hidden' }}>Sign In</span>
              </>
            ) : 'Sign In'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login; 