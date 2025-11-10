import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const OrderSuccess = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="primary">
          Order Success
        </Typography>
        <Typography variant="body1">
          Thank you! Your order has been placed successfully.
        </Typography>
      </Paper>
    </Container>
  );
};

export default OrderSuccess;




