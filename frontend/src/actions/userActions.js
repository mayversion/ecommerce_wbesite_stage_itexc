import axios from 'axios';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  CLEAR_ERRORS
} from '../store/constants/authConstants';

// Login user
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.post('/api/auth/login', { email, password }, config);

    // Store token in localStorage for cross-domain authentication
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.user
    });

  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data.message
    });
  }
};

// Register user
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.post('/api/auth/register', userData, config);

    // Store token in localStorage for cross-domain authentication
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    dispatch({
      type: REGISTER_SUCCESS,
      payload: data.user
    });

  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
      payload: error.response.data.message
    });
  }
};

// Load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const { data } = await axios.get('/api/auth/me');

    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data.user
    });

  } catch (error) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response.data.message
    });
  }
};

// Logout user
export const logout = () => async (dispatch) => {
  try {
    await axios.get('/api/auth/logout');

    // Remove token from localStorage
    localStorage.removeItem('token');

    dispatch({
      type: LOGOUT_SUCCESS
    });

  } catch (error) {
    dispatch({
      type: LOGOUT_FAIL,
      payload: error.response.data.message
    });
  }
};

// Update profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.put('/api/auth/updateprofile', userData, config);

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: data.user
    });

  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.message
    });
  }
};

// Update password
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.put('/api/auth/updatepassword', passwords, config);

    dispatch({
      type: UPDATE_PASSWORD_SUCCESS,
      payload: data.user
    });

  } catch (error) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error.response.data.message
    });
  }
};

// Forgot password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.post('/api/auth/forgotpassword', { email }, config);

    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: data.message
    });

  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.message
    });
  }
};

// Reset password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.put(`/api/auth/resetpassword/${token}`, passwords, config);

    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: data.user
    });

  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
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