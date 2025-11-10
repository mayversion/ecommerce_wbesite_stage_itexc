import axios from 'axios';
import {
  NEW_ORDER_REQUEST,
  NEW_ORDER_SUCCESS,
  NEW_ORDER_FAIL,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  CLEAR_ERRORS
} from '../store/constants/orderConstants';

// Create new order
export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_ORDER_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.post('/api/orders/order/new', orderData, config);

    dispatch({
      type: NEW_ORDER_SUCCESS,
      payload: data.order
    });

  } catch (error) {
    dispatch({
      type: NEW_ORDER_FAIL,
      payload: error.response.data.message
    });
  }
};

// Get my orders
export const myOrders = () => async (dispatch) => {
  try {
    dispatch({ type: MY_ORDERS_REQUEST });

    const { data } = await axios.get('/api/orders/orders/me');

    dispatch({
      type: MY_ORDERS_SUCCESS,
      payload: data.orders
    });

  } catch (error) {
    dispatch({
      type: MY_ORDERS_FAIL,
      payload: error.response.data.message
    });
  }
};

// Get order details
export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/orders/order/${id}`);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data.order
    });

  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.response.data.message
    });
  }
};

// Clear errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS
  });
};




