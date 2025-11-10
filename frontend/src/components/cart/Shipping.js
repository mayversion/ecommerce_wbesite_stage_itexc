import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../../actions/orderActions';
import { clearCart } from '../../actions/cartActions';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { CheckCircle, LocalShipping } from '@mui/icons-material';

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingInfo: formData,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
        paymentInfo: {
          id: 'cash_on_delivery_' + Date.now(),
          status: 'pending'
        }
      };

      await dispatch(createOrder(orderData));
      
      dispatch(clearCart());
      
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate('/orders/me');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5">Your cart is empty</Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/products')}
          >
            Go Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom color="success.main">
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Thank you for your order! A confirmation email has been sent to your email address.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can track your order status in the "My Orders" page.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Redirecting to your orders...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} className="glass-card" sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LocalShipping sx={{ fontSize: 40, mr: 2, color: 'secondary.main' }} />
          <Typography variant="h4">
            Shipping Information
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Order Summary</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Subtotal:</Typography>
            <Typography>${subtotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Shipping:</Typography>
            <Typography>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Tax:</Typography>
            <Typography>${tax.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" color="secondary">${total.toFixed(2)}</Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="State/Province"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="ZIP/Postal Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/cart')}
                  disabled={loading}
                  fullWidth
                >
                  Back to Cart
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  className="glow-button"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Shipping;
