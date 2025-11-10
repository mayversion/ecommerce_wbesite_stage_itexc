const express = require('express');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getCategories
} = require('../controllers/products');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/categories')
  .get(getCategories);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.route('/:id/reviews')
  .get(getProductReviews)
  .post(protect, createProductReview);

router.route('/:id/reviews/:reviewId')
  .delete(protect, authorize('admin'), deleteReview);

module.exports = router;





