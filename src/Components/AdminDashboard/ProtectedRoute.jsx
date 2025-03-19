import React from 'react';
import { Navigate } from 'react-router-dom';

// Mock function to check if user is authenticated
const isAuthenticated = () => {
  // Replace this with actual authentication logic
  return !!sessionStorage.getItem('authToken'); // Example check
};

const ProtectedRoute = ({ element: Component, ...rest }) => {
  return isAuthenticated() ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
