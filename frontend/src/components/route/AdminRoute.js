import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector(state => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;




