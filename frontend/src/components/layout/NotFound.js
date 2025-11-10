import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { Home } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/"
        startIcon={<Home />}
        size="large"
      >
        Go Home
      </Button>
    </Container>
  );
};

export default NotFound;




