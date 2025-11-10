import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors } from '../../actions/userActions';
import { addToCart } from '../../actions/cartActions';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Link as MuiLink
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, error } = useSelector(state => state.auth);

  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';
  const reason = params.get('reason');

  useEffect(() => {
    if (isAuthenticated) {
      // If there was a pending add-to-cart before login, process it now
      try {
        const raw = localStorage.getItem('pending_add_to_cart');
        if (raw) {
          const { id, quantity } = JSON.parse(raw);
          if (id && quantity) {
            dispatch(addToCart(id, quantity));
          }
          localStorage.removeItem('pending_add_to_cart');
        }
      } catch (_) {}
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect, dispatch]);

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} className="glass-card" sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography component="h1" variant="h4" gutterBottom>
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back! Please sign in to your account.
            </Typography>
          </Box>

          {reason === 'add_to_cart' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Please sign in to add items to your cart.
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              className="glow-button"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <MuiLink
                component={Link}
                to="/password/forgot"
                variant="body2"
                sx={{ textDecoration: 'none' }}
              >
                Forgot your password?
              </MuiLink>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <MuiLink
                  component={Link}
                  to="/register"
                  variant="body2"
                  sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                >
                  Sign up here
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;




