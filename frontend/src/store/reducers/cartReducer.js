import {
  SET_CART,
  ADD_TO_CART,
  REMOVE_ITEM_CART,
  SAVE_SHIPPING_INFO,
  CLEAR_CART
} from '../constants/cartConstants';

export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {
  switch (action.type) {
    case SET_CART:
      return {
        ...state,
        cartItems: Array.isArray(action.payload) ? action.payload : []
      };
    case ADD_TO_CART:
      const item = action.payload;
      const isItemExist = state.cartItems.find(i => i.product === item.product);

      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map(i =>
            i.product === item.product ? item : i
          )
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item]
        };
      }

    case REMOVE_ITEM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(i => i.product !== action.payload)
      };

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload
      };

    case CLEAR_CART:
      return {
        ...state,
        cartItems: []
      };

    default:
      return state;
  }
};





