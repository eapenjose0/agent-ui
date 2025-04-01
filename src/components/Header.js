import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Chip, Avatar, Container, useMediaQuery, useTheme } from '@mui/material';
import { Logout, Person } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar 
          sx={{ 
            py: { xs: 1.25, md: 1.5 },
            px: { xs: 1, md: 2 },
            minHeight: { xs: '64px', md: '72px' },
            display: 'flex',
            justifyContent: 'space-between',
          }}
          disableGutters
        >
          {/* Logo section - aligned to the left */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <Box sx={{ 
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              position: 'relative',
              py: 1,
            }}>
              <Logo />
            </Box>
            
            {/* Mobile logo text only */}
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                display: { xs: 'block', sm: 'none' },
                fontSize: '1.3rem',
                color: '#FF5722',
                fontWeight: 700,
                fontFamily: '"Share Tech Mono", "Orbitron", monospace',
                letterSpacing: '0.12em',
                textAlign: 'left',
                py: 1,
                position: 'relative',
              }}
            >
              <span style={{ 
                fontSize: '1.6rem', 
                fontWeight: 800,
                color: '#FF5722',
                letterSpacing: '0.1em',
                marginRight: '2px'
              }}>A</span>
              <span style={{ 
                letterSpacing: '0.15em',
                fontSize: '1.3rem'
              }}>GENTS</span>
            </Typography>
          </Box>
          
          {/* Empty middle section to maintain layout */}
          <Box sx={{ flex: 1 }} />
          
          {/* User controls section */}
          {isAuthenticated && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              justifyContent: 'flex-end',
              width: { xs: '60px', sm: '180px' },
              zIndex: 5,
            }}>
              <Chip
                avatar={
                  <Avatar sx={{ bgcolor: 'rgba(255, 87, 34, 0.12)', color: '#FF5722' }}>
                    <Person sx={{ fontSize: '1.1rem' }} />
                  </Avatar>
                }
                label={currentUser?.email || 'User'}
                variant="outlined"
                color="primary"
                sx={{
                  borderRadius: '20px',
                  height: '32px',
                  display: { xs: 'none', sm: 'flex' },
                  '& .MuiChip-label': {
                    px: 1,
                    fontSize: '0.8125rem',
                    fontWeight: 500
                  },
                  border: '1px solid rgba(255, 87, 34, 0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 87, 34, 0.04)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }
                }}
              />
              
              <Button 
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<Logout sx={{ fontSize: '1rem' }} />}
                onClick={logout}
                sx={{
                  borderRadius: '20px',
                  px: 1.5,
                  py: 0.75,
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  borderColor: 'rgba(255, 87, 34, 0.5)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#FF5722',
                    backgroundColor: 'rgba(255, 87, 34, 0.04)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }
                }}
              >
                {!isMobile && 'Logout'}
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 