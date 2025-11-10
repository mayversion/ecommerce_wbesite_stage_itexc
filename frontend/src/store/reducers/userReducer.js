import {
  ADD_ADDRESS_REQUEST,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAIL,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAIL,
  DELETE_ADDRESS_REQUEST,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_FAIL,
  SET_DEFAULT_ADDRESS_REQUEST,
  SET_DEFAULT_ADDRESS_SUCCESS,
  SET_DEFAULT_ADDRESS_FAIL,
  CLEAR_ERRORS
} from '../constants/userConstants';

export const userReducer = (state = { addresses: [] }, action) => {
  switch (action.type) {
    case ADD_ADDRESS_REQUEST:
    case UPDATE_ADDRESS_REQUEST:
    case DELETE_ADDRESS_REQUEST:
    case SET_DEFAULT_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true
      };

    case ADD_ADDRESS_SUCCESS:
    case UPDATE_ADDRESS_SUCCESS:
    case DELETE_ADDRESS_SUCCESS:
    case SET_DEFAULT_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: action.payload
      };

    case ADD_ADDRESS_FAIL:
    case UPDATE_ADDRESS_FAIL:
    case DELETE_ADDRESS_FAIL:
    case SET_DEFAULT_ADDRESS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};





