import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Paper,
  FormHelperText,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import { FilterList, CategoryOutlined } from '@mui/icons-material';
import { ShoppingCart } from '@mui/icons-material';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, products, error, productsCount, resPerPage } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState([0, 25000]);
  const [ratings, setRatings] = useState(0);

  useEffect(() => {
    dispatch(getProducts(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shop All Products
      </Typography>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterList fontSize="small" />
          <Typography variant="subtitle1">Filters</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search products..."
              value={keyword}
              onChange={handleSearch}
              size="small"
              sx={{ minWidth: 260, backgroundColor: 'background.paper' }}
            />

            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                input={
                  <OutlinedInput
                    label="Category"
                    startAdornment={
                      <InputAdornment position="start">
                        <CategoryOutlined fontSize="small" />
                      </InputAdornment>
                    }
                  />
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="home">Home</MenuItem>
                <MenuItem value="sports">Sports</MenuItem>
              </Select>
              <FormHelperText>Choose a category</FormHelperText>
            </FormControl>
          </Box>
          <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
            {products && products.length ? `Showing ${products.length} products` : 'No products'}
          </Box>
        </Box>
      </Paper>

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
                  {product.description.substring(0, 100)}...
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
                <Button
                  size="small"
                  startIcon={<ShoppingCart />}
                  fullWidth
                  onClick={() => {
                    if (!isAuthenticated) {
                      try { localStorage.setItem('pending_add_to_cart', JSON.stringify({ id: product._id, quantity: 1 })); } catch (_) {}
                      navigate('/login?redirect=/cart&reason=add_to_cart');
                      return;
                    }
                    dispatch(addToCart(product._id, 1));
                    navigate('/cart');
                  }}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {resPerPage < productsCount && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(productsCount / resPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default Products;




