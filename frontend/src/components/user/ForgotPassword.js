import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearErrors } from '../../actions/userActions';
import { Container, Typography, Paper, Box, TextField, Button, Alert, CircularProgress } from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.forgotPassword || state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    dispatch(forgotPassword(email));
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} className="glass-card" sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your account email. If it exists, we'll send a password reset link.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearErrors())}>
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="secondary" className="glow-button" disabled={loading}>
            {loading ? <CircularProgress size={22} /> : 'Send reset link'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;




