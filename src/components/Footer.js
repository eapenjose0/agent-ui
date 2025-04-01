import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} OutMarket AI - All rights reserved
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          <Link color="inherit" href="https://outmarket.ai/terms">
            Terms
          </Link>{' | '}
          <Link color="inherit" href="https://outmarket.ai/privacy">
            Privacy
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 