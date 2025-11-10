import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword, clearErrors } from '../../actions/userActions';
import { Container, Typography, Paper, Box, TextField, Button, Alert, CircularProgress } from '@mui/material';

const NewPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });

  useEffect(() => {
    // Clear any stale error/message from persisted state when landing on this page
    dispatch(clearErrors());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwords.password || passwords.password !== passwords.confirmPassword) return;
    dispatch(resetPassword(token, { password: passwords.password }));
  };

  const handleGoLogin = () => navigate('/login');

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your new password.
        </Typography>

        {error && typeof error === 'string' && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearErrors())}>
            {error}
          </Alert>
        )}
        {message && typeof message === 'string' && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            type="password"
            label="New password"
            name="password"
            value={passwords.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            required
            type="password"
            label="Confirm new password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={22} /> : 'Update password'}
            </Button>
            <Button variant="text" onClick={handleGoLogin}>Back to Login</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewPassword;




