import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardMedia
} from '@mui/material';
import {
  Receipt,
  LocalShipping,
  Person,
  ArrowBack
} from '@mui/icons-material';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/orders/order/${id}`);
      setOrder(data.order);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order details');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'warning';
      case 'Shipped':
        return 'info';
      case 'Delivered':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          component={RouterLink}
          to="/orders/me"
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Order not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Receipt sx={{ fontSize: 40, color: 'secondary.main' }} />
          <Box>
            <Typography variant="h4">Order Details</Typography>
            <Typography variant="body2" color="text.secondary">
              Order ID: {order._id}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={order.orderStatus}
          color={getStatusColor(order.orderStatus)}
          size="large"
        />
      </Box>

      <Button
        component={RouterLink}
        to="/orders/me"
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Back to Orders
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} className="glass-card" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Receipt /> Order Items
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItems?.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {item.image && (
                            <CardMedia
                              component="img"
                              sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                              image={item.image}
                              alt={item.name}
                            />
                          )}
                          <Typography variant="body2">{item.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">${item.price?.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <strong>${(item.price * item.quantity)?.toFixed(2)}</strong>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper elevation={2} className="glass-card" sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShipping /> Shipping Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Name</Typography>
              <Typography variant="body1">{order.shippingInfo?.name}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Phone</Typography>
              <Typography variant="body1">{order.shippingInfo?.phone}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Address</Typography>
              <Typography variant="body1">
                {order.shippingInfo?.address}<br />
                {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.zipCode}<br />
                {order.shippingInfo?.country}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} className="glass-card" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>${order.itemsPrice?.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping:</Typography>
              <Typography>${order.shippingPrice?.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tax:</Typography>
              <Typography>${order.taxPrice?.toFixed(2)}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="secondary">
                ${order.totalPrice?.toFixed(2)}
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={2} className="glass-card" sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Status
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Current Status</Typography>
              <Chip
                label={order.orderStatus}
                color={getStatusColor(order.orderStatus)}
                sx={{ mt: 1 }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Order Date</Typography>
              <Typography variant="body1">
                {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
              </Typography>
            </Box>

            {order.deliveredAt && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Delivered On</Typography>
                <Typography variant="body1">
                  {new Date(order.deliveredAt).toLocaleDateString()}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography variant="body2" color="text.secondary">Payment Status</Typography>
              <Typography variant="body1">{order.paymentInfo?.status || 'Pending'}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetails;
