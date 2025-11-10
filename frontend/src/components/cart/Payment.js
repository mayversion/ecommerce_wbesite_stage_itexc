import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Payment = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Payment
        </Typography>
      </Paper>
    </Container>
  );
};

export default Payment;




