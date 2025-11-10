import React from 'react';
import { Container, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Cancel = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Payment canceled
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Your payment was canceled. You can continue shopping or try again.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/cart')} sx={{ mr: 2 }}>
          Back to Cart
        </Button>
        <Button variant="outlined" onClick={() => navigate('/')}>Continue Shopping</Button>
      </Paper>
    </Container>
  );
};

export default Cancel;
