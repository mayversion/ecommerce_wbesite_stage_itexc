import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import { authReducer } from './reducers/authReducer';
import { productReducer, productDetailsReducer, newReviewReducer } from './reducers/productReducer';
import { cartReducer } from './reducers/cartReducer';
import { newOrderReducer, myOrdersReducer, orderDetailsReducer } from './reducers/orderReducer';
import { userReducer } from './reducers/userReducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
};

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  productDetails: productDetailsReducer,
  newReview: newReviewReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  user: userReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export const persistor = persistStore(store);

// Persist cart per-user in localStorage
const getCartKey = (state) => {
  const uid = state?.auth?.user?.id;
  return uid ? `cart_${uid}` : 'cart_guest';
};

// Hydrate initial guest cart into memory after persisted auth is rehydrated
persistor.subscribe(() => {
  const state = store.getState();
  // Only run once after rehydrate; if cart already has items, skip
  if (!state?.auth?.loading && state?.cart?.cartItems?.__hydrated !== true) {
    try {
      const key = getCartKey(state);
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Flag to avoid loops; reducer ignores unknown fields but we can mark in memory
        store.dispatch({ type: 'SET_CART', payload: parsed });
      }
    } catch (_) { /* noop */ }
  }
});

// Save on every change
let lastSerialized = '';
let lastUserId = undefined;
store.subscribe(() => {
  const state = store.getState();
  try {
    // Detect login/logout or user switch and REPLACE cart with stored user-specific cart
    const uid = state?.auth?.user?.id;
    if (uid !== lastUserId) {
      lastUserId = uid;
      const key = getCartKey(state);
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      store.dispatch({ type: 'SET_CART', payload: parsed });
    }

    const key = getCartKey(state);
    const data = JSON.stringify(state.cart.cartItems || []);
    if (data !== lastSerialized) {
      localStorage.setItem(key, data);
      lastSerialized = data;
    }
  } catch (_) { /* noop */ }
});

export default store;





