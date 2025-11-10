import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../actions/productActions';
import { addToCart } from '../../actions/cartActions';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  Rating,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const query = useQuery();

  const keyword = query.get('keyword') || '';

  const { loading, products, error, productsCount, resPerPage } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  useEffect(() => {
    // Search by keyword; keep default price range and ratings; no category filter here
    dispatch(getProducts(keyword, currentPage));
  }, [dispatch, keyword, currentPage]);

  const handlePageChange = (event, value) => setCurrentPage(value);

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        {keyword ? `Results for "${keyword}"` : 'All Results'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {products && products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 150ms ease, box-shadow 150ms ease', '&:hover': { transform: 'translateY(-4px)' } }}>
              {product.images[0]?.url ? (
                <Box onClick={() => navigate(`/product/${product._id}`)} sx={{ cursor: 'pointer' }}>
                  <CardMedia component="img" height="200" image={product.images[0].url} alt={product.name} sx={{ objectFit: 'cover' }} />
                </Box>
              ) : (
                <Box sx={{ height: 200, position: 'relative' }}>
                  <Box sx={{ position: 'absolute', inset: 0, background: (theme)=>`linear-gradient(135deg, ${theme.palette.primary.light}33, ${theme.palette.primary.main}66)` }} />
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product._id}`)}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {product.description?.substring(0, 100)}...
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={product.ratings} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({product.numOfReviews})
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary">
                  ${product.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<ShoppingCart />} fullWidth onClick={() => {
                  if (!isAuthenticated) {
                    try { localStorage.setItem('pending_add_to_cart', JSON.stringify({ id: product._id, quantity: 1 })); } catch (_) {}
                    navigate('/login?redirect=/cart&reason=add_to_cart');
                    return;
                  }
                  dispatch(addToCart(product._id, 1));
                  navigate('/cart');
                }}>
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {resPerPage < productsCount && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={Math.ceil(productsCount / resPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
        </Box>
      )}
    </Container>
  );
};

export default Search;




