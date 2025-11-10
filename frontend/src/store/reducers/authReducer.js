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
} from '../constants/authConstants';

export const authReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case LOAD_USER_REQUEST:
      return {
        loading: true,
        isAuthenticated: false
      };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case LOAD_USER_SUCCESS:
      return {
        loading: false,
        isAuthenticated: true,
        user: action.payload
      };

    case LOGOUT_SUCCESS:
      return {
        loading: false,
        isAuthenticated: false,
        user: null
      };

    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case LOAD_USER_FAIL:
    case LOGOUT_FAIL:
      return {
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload
      };

    case UPDATE_PROFILE_REQUEST:
    case UPDATE_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true
      };

    case UPDATE_PROFILE_SUCCESS:
    case UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload
      };

    case UPDATE_PROFILE_FAIL:
    case UPDATE_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case FORGOT_PASSWORD_REQUEST:
    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        message: null
      };

    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        message: 'Password updated successfully'
      };

    case FORGOT_PASSWORD_FAIL:
    case RESET_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        message: null
      };

    default:
      return state;
  }
};





