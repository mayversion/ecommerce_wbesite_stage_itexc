import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, createProductReview, clearErrors } from '../../actions/productActions';
import { addToCart } from '../../actions/cartActions';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  ShoppingCart,
  Star,
  Add,
  Remove,
  ThumbUp,
  ThumbDown
} from '@mui/icons-material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewDialog, setReviewDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { product, loading, error } = useSelector(state => state.productDetails);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { success, error: reviewError } = useSelector(state => state.newReview);

  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      setReviewDialog(false);
      setRating(0);
      setComment('');
      setSnackbar({ open: true, message: 'Review submitted successfully!', severity: 'success' });
      // Reload product details to show the new review
      dispatch(getProductDetails(id));
    }
    if (reviewError) {
      setSnackbar({ open: true, message: reviewError, severity: 'error' });
      dispatch(clearErrors());
    }
  }, [success, reviewError, dispatch, id]);

  const increaseQty = () => {
    if (product.stock <= quantity) return;
    setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };
  
  // Styles pour les boutons de quantité
  const quantityButtonStyle = {
    minWidth: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: '1px solid #ddd',
    '&:hover': {
      backgroundColor: '#e0e0e0'
    },
    '&.Mui-disabled': {
      opacity: 0.5,
      backgroundColor: '#f5f5f5'
    }
  };
  
  const quantityInputStyle = {
    width: '60px',
    textAlign: 'center',
    '& .MuiOutlinedInput-root': {
      height: '40px'
    },
    '& .MuiOutlinedInput-input': {
      textAlign: 'center',
      padding: '8px 12px'
    }
  };

  const addToCartHandler = () => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem('pending_add_to_cart', JSON.stringify({ id, quantity }));
      } catch (_) {}
      navigate(`/login?redirect=/cart&reason=add_to_cart`);
      return;
    }
    dispatch(addToCart(id, quantity));
    navigate('/cart');
  };

  const submitReview = () => {
    const reviewData = {
      rating,
      comment,
      productId: id
    };
    dispatch(createProductReview(reviewData));
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} className="glass-card" sx={{ p: 2 }}>
            <Carousel showThumbs={false} showStatus={false}>
              {product.images && product.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image.url}
                    alt={product.name}
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </Carousel>
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.ratings} readOnly precision={0.5} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({product.numOfReviews} reviews)
              </Typography>
            </Box>

            <Typography variant="h4" gutterBottom sx={{ background: 'linear-gradient(90deg, #F472B6, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
              ${product.price}
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Features:
              </Typography>
              {product.features && product.features.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Specifications:
              </Typography>
              {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {key}:
                  </Typography>
                  <Typography variant="body2">
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ mr: 2 }}>
                Quantity:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={decreaseQty}
                  disabled={quantity <= 1}
                  sx={{
                    minWidth: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #ddd',
                    '&:hover': {
                      backgroundColor: '#e0e0e0'
                    },
                    '&.Mui-disabled': {
                      opacity: 0.5,
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <Remove />
                </Button>
                <TextField
                  value={quantity}
                  type="number"
                  variant="outlined"
                  size="small"
                  sx={{
                    width: '60px',
                    textAlign: 'center',
                    '& .MuiOutlinedInput-root': {
                      height: '40px'
                    },
                    '& .MuiOutlinedInput-input': {
                      textAlign: 'center',
                      padding: '8px 12px'
                    }
                  }}
                  inputProps={{
                    min: 1,
                    max: product.stock,
                    style: {
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }
                  }}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 1 && value <= product.stock) {
                      setQuantity(value);
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={increaseQty}
                  disabled={quantity >= product.stock}
                  sx={{
                    minWidth: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #ddd',
                    '&:hover': {
                      backgroundColor: '#e0e0e0'
                    },
                    '&.Mui-disabled': {
                      opacity: 0.5,
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <Add />
                </Button>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Stock: {product.stock} available
              </Typography>

              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                onClick={addToCartHandler}
                startIcon={<ShoppingCart />}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #F472B6, #A78BFA)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Add to Cart
              </Button>

              {isAuthenticated && (
                <Button 
                  variant="outlined"
                  color="primary" 
                  fullWidth
                  onClick={() => setReviewDialog(true)}
                  sx={{ mt: 2 }}
                >
                  Write a Review
                </Button>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Reviews Section */}
        <Grid item xs={12}>
          <Paper elevation={2} className="glass-card" sx={{ p: 3, mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                Customer Reviews
              </Typography>
              {product.numOfReviews > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={product.ratings} readOnly precision={0.5} />
                  <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                    ({product.numOfReviews} reviews)
                  </Typography>
                </Box>
              )}
            </Box>
            
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <Box key={review._id} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ mr: 2 }}>
                      {review.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {review.name}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ ml: 7 }}>
                    {review.comment}
                  </Typography>
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No reviews yet. Be the first to review this product!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Rating:
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>Cancel</Button>
          <Button 
            onClick={submitReview} 
            variant="contained" 
            color="primary"
            disabled={!rating || !comment.trim()}
            sx={{
              background: 'linear-gradient(90deg, #F472B6, #A78BFA)',
              '&:disabled': {
                background: '#e0e0e0',
                color: '#9e9e9e'
              }
            }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetails;




