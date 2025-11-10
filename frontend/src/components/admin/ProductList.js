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
  IconButton,
  Box,
  Button,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ProductList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPage = async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`/api/products?page=${p}`);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPage(page); /* eslint-disable-next-line */ }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      fetchPage(page);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Delete failed');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Product Management</Typography>
        <Button variant="contained" onClick={() => navigate('/admin/product')}>New Product</Button>
      </Box>

      {loading && (<Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress /></Box>)}
      {error && (<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>)}

      {!loading && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p._id} hover>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>${p.price}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => navigate(`/admin/product/${p._id}`)} size="small"><Edit /></IconButton>
                      <IconButton onClick={() => handleDelete(p._id)} size="small" color="error"><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination count={totalPages} page={page} onChange={(e, val) => setPage(val)} />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductList;




