import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Receipt,
  LocalShipping,
  Person,
  ArrowBack,
  Save,
  Print
} from '@mui/icons-material';

const ProcessOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/orders/order/${id}`);
      setOrder(data.order);
      setStatus(data.order.orderStatus);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order details');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      setError('');
      setSuccessMsg('');

      const { data } = await axios.put(`/api/orders/admin/order/${id}`, { status });
      
      setOrder(data.order);
      setSuccessMsg('Order status updated successfully!');
      setUpdating(false);

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
      setUpdating(false);
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          onClick={() => navigate('/admin/orders')}
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
            <Typography variant="h4">Process Order</Typography>
            <Typography variant="body2" color="text.secondary">
              Order ID: {order._id}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={handlePrint}
          >
            Print
          </Button>
        </Box>
      </Box>

      <Button
        onClick={() => navigate('/admin/orders')}
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Back to Orders
      </Button>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} className="glass-card" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person /> Customer Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Customer Name</Typography>
                <Typography variant="body1">{order.user?.name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{order.user?.email || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={2} className="glass-card" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShipping /> Shipping Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Recipient Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{order.shippingInfo?.name}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Phone Number</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{order.shippingInfo?.phone}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Shipping Address</Typography>
                <Paper sx={{ p: 2, mt: 1, bgcolor: 'background.default' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {order.shippingInfo?.name}
                  </Typography>
                  <Typography variant="body1">
                    {order.shippingInfo?.address}
                  </Typography>
                  <Typography variant="body1">
                    {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.zipCode}
                  </Typography>
                  <Typography variant="body1">
                    {order.shippingInfo?.country}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={2} className="glass-card" sx={{ p: 3 }}>
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
                      <TableCell align="center">
                        <Chip label={item.quantity} size="small" color="secondary" />
                      </TableCell>
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
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} className="glass-card" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Update Order Status
            </Typography>
            <Divider sx={{ my: 2 }} />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Order Status</InputLabel>
              <Select
                value={status}
                label="Order Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Shipped">Shipped</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="secondary"
              className="glow-button"
              fullWidth
              startIcon={<Save />}
              onClick={handleUpdateStatus}
              disabled={updating || status === order.orderStatus}
            >
              {updating ? <CircularProgress size={24} /> : 'Update Status'}
            </Button>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">Current Status</Typography>
              <Chip
                label={order.orderStatus}
                color={getStatusColor(order.orderStatus)}
                sx={{ mt: 1 }}
              />
            </Box>
          </Paper>

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
              Order Timeline
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Order Placed</Typography>
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

export default ProcessOrder;
