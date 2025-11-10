import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './actions/userActions';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import ProductDetails from './components/product/ProductDetails';
import Products from './components/product/Products';
import Search from './components/product/Search';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import NewPassword from './components/user/NewPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';
import Cancel from './components/cart/Cancel';
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails';
import Dashboard from './components/admin/Dashboard';
import ProductList from './components/admin/ProductList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrderList from './components/admin/OrderList';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UsersList';
import UpdateUser from './components/admin/UpdateUser';
import ProductReviews from './components/admin/ProductReviews';
import NotFound from './components/layout/NotFound';
import ProtectedRoute from './components/route/ProtectedRoute';
import AdminRoute from './components/route/AdminRoute';
import About from './components/static/About';
import Contact from './components/static/Contact';
import Returns from './components/static/Returns';
import Privacy from './components/static/Privacy';
import Terms from './components/static/Terms';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    // Always attempt to load the user on app start to hydrate auth state
    dispatch(loadUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <div className="App">
        <Header />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<NewPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
          <Route path="/order/confirm" element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
          <Route path="/process/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/orders/me" element={<ProtectedRoute><ListOrders /></ProtectedRoute>} />
          <Route path="/order/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/me" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/me/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
          <Route path="/password/update" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><ProductList /></AdminRoute>} />
          <Route path="/admin/product" element={<AdminRoute><NewProduct /></AdminRoute>} />
          <Route path="/admin/product/:id" element={<AdminRoute><UpdateProduct /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><OrderList /></AdminRoute>} />
          <Route path="/admin/order/:id" element={<AdminRoute><ProcessOrder /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UsersList /></AdminRoute>} />
          <Route path="/admin/user/:id" element={<AdminRoute><UpdateUser /></AdminRoute>} />
          <Route path="/admin/reviews" element={<AdminRoute><ProductReviews /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
  );
}

export default App;





