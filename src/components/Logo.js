import React from 'react';
import { Box, Typography } from '@mui/material';

const Logo = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      marginBottom: { xs: 0, sm: 3 },
      mx: 'auto',
      position: 'relative',
      width: '100%',
      px: 2,
      py: 1
    }}>
      {/* SVG Filter for Drop Shadow - Removed */}
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg 
          width="40" 
          height="35" 
          viewBox="0 0 45 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19.8029 28.012C24.005 29.553 28.665 27.3932 30.206 23.1849C30.404 22.6465 30.5402 22.0957 30.6206 21.5449H37.589L44.9102 21.6254L36.8278 25.2148C36.7907 25.3324 36.7535 25.4499 36.7102 25.5737C33.8511 33.3776 25.2118 37.3816 17.4141 34.5287C11.702 32.4369 8.03212 27.2508 7.58654 21.5573H14.5611C14.9758 24.4103 16.9004 26.9538 19.7967 28.0182L19.8029 28.012Z" fill="#FF5722"/>
          <path d="M25.4383 11.9798C21.2362 10.4388 16.5762 12.5986 15.0352 16.8069C14.8372 17.3453 14.701 17.8961 14.6206 18.4469H7.64597L0.324821 18.3664L8.40717 14.777C8.4443 14.6594 8.48144 14.5419 8.52476 14.4181C11.3777 6.6204 20.017 2.61017 27.8209 5.46932C33.533 7.56108 37.2029 12.7472 37.6484 18.4407H30.6739C30.2592 15.5877 28.3346 13.0442 25.4383 11.9798Z" fill="#FF5722"/>
        </svg>
        
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#FF5722', 
            marginLeft: 2,
            fontFamily: '"Share Tech Mono", "Orbitron", monospace',
            fontWeight: 700,
            fontSize: '1.4rem',
            letterSpacing: '0.12em',
            position: 'relative',
            // Removed text shadow and underline
          }}
        >
          <span style={{ 
            fontSize: '1.7rem', 
            fontWeight: 800,
            color: '#FF5722',
            letterSpacing: '0.1em',
            marginRight: '2px'
          }}>A</span>
          <span style={{ 
            letterSpacing: '0.15em',
            fontSize: '1.4rem'
          }}>GENTS</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo; 