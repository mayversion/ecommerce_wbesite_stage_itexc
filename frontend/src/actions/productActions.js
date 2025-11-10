import axios from 'axios';
import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_RESET,
  CLEAR_ERRORS
} from '../store/constants/productConstants';

// Get all products
export const getProducts = (keyword = '', currentPage = 1, price = [0, 25000], category, ratings = 0) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PRODUCTS_REQUEST });

    let link = `/api/products?search=${encodeURIComponent(keyword)}&page=${currentPage}&minPrice=${price[0]}&maxPrice=${price[1]}&rating=${ratings}`;

    if (category) {
      link += `&category=${encodeURIComponent(category)}`;
    }

    const { data } = await axios.get(link);

    dispatch({
      type: ALL_PRODUCTS_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: ALL_PRODUCTS_FAIL,
      payload: error?.response?.data?.message || error.message || 'Failed to load products'
    });
  }
};

// Get product details
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product
    });

  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error?.response?.data?.message || error.message || 'Failed to load product details'
    });
  }
};

// Create new review
export const createProductReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.post(`/api/products/${reviewData.productId}/reviews`, reviewData, config);

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success
    });

  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error?.response?.data?.message || error.message || 'Failed to submit review'
    });
  }
};

// Clear errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS
  });
};