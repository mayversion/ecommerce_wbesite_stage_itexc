import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility,
  Delete,
  Edit,
  ShoppingBag
} from '@mui/icons-material';

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders/admin/orders');
      setOrders(data.orders || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await axios.delete(`/api/orders/admin/order/${id}`);
      setOrders(orders.filter(order => order._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete order');
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ShoppingBag sx={{ fontSize: 40, color: 'secondary.main' }} />
          <Typography variant="h4">
            Order Management
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary">
          Total Orders: {orders.length}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Paper elevation={2} className="glass-card" sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No orders found
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2} className="glass-card">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell align="center"><strong>Items</strong></TableCell>
                <TableCell align="right"><strong>Total</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Date</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {order._id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{order.user?.name || 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.user?.email || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={order.orderItems?.length || 0}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ${order.totalPrice?.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={order.orderStatus}
                      color={getStatusColor(order.orderStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="caption">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/order/${order._id}`)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Order">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => navigate(`/admin/order/${order._id}`)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Order">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteOrder(order._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default OrderList;
