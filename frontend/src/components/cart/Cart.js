import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../../actions/cartActions';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Alert
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  ArrowBack
} from '@mui/icons-material';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const { cartItems } = useSelector(state => state.cart);

  const increaseQty = (id, quantity, stock) => {
    if (stock <= quantity) return;
    dispatch(addToCart(id, quantity + 1));
  };

  const decreaseQty = (id, quantity) => {
    if (quantity <= 1) return;
    dispatch(addToCart(id, quantity - 1));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const applyCoupon = () => {
    // Implement coupon logic here
    if (couponCode === 'WELCOME10') {
      setDiscount(10);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax - discount;

  const handleStripeCheckout = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/checkout/session`);
      if (data && data.success && data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Stripe Checkout error', err);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} className="glass-card" sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add some products to get started
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            className="glow-button"
            onClick={() => navigate('/products')}
            startIcon={<ArrowBack />}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper} elevation={2} className="glass-card">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.product}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CardMedia
                          component="img"
                          sx={{ width: 80, height: 80, objectFit: 'cover', mr: 2 }}
                          image={item.image}
                          alt={item.name}
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Stock: {item.stock}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => decreaseQty(item.product, item.quantity)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => increaseQty(item.product, item.quantity, item.stock)}
                          disabled={item.stock <= item.quantity}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">${item.price}</TableCell>
                    <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')}
              startIcon={<ArrowBack />}
            >
              Continue Shopping
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} className="glass-card" sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                size="small"
                sx={{ mb: 1 }}
              />
              <Button
                variant="outlined"
                onClick={applyCoupon}
                fullWidth
                size="small"
              >
                Apply Coupon
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>${subtotal.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping:</Typography>
              <Typography>
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tax:</Typography>
              <Typography>${tax.toFixed(2)}</Typography>
            </Box>

            {discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="success.main">Discount:</Typography>
                <Typography color="success.main">-${discount.toFixed(2)}</Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">${total.toFixed(2)}</Typography>
            </Box>

            <Button
              variant="contained"
              color="secondary"
              className="glow-button"
              fullWidth
              size="large"
              onClick={() => navigate('/shipping')}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </Button>

            <Button
              sx={{ mt: 2 }}
              variant="outlined"
              fullWidth
              size="large"
              onClick={handleStripeCheckout}
              disabled={cartItems.length === 0}
            >
              Pay $19.00 with Stripe
            </Button>

            {shipping === 0 && (
              <Alert severity="success" sx={{ mt: 2 }}>
                You qualify for free shipping!
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
