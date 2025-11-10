import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { myOrders, clearErrors } from '../../actions/orderActions';
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
  Box,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';

const ListOrders = () => {
  const dispatch = useDispatch();
  const { loading, error, orders } = useSelector(state => state.myOrders);

  useEffect(() => {
    dispatch(myOrders());
    return () => { dispatch(clearErrors()); };
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {loading && (
        <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress /></Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {!loading && !error && (
        <TableContainer component={Paper} className="glass-card">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(orders || []).map((o) => (
                <TableRow key={o._id} hover>
                  <TableCell>{o._id}</TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{o.orderStatus || o.status || 'Processing'}</TableCell>
                  <TableCell>${(o.totalPrice || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="contained" color="secondary" className="glow-button" component={RouterLink} to={`/order/${o._id}`}>Details</Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!orders || orders.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ListOrders;




