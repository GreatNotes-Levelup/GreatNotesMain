import React from 'react';
import useAuth from '../components/UserContext.js';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user } = useAuth();

  // Basic check for if the user has a token saved.
  return user ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;