import React from 'react';
import useAuth from '../components/UserContext.js';
import { Navigate, Outlet } from 'react-router-dom';
import { parseJwt } from '../utils.js';

const ProtectedRoute = () => {
  const { user, removeCurrentUser } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }
  let userJwt = parseJwt(user.access_token);
  if (Date.now() >= userJwt.exp * 1000) {
    setTimeout(removeCurrentUser, 0);
    return <Navigate to="/" replace />;
  }

  return <Outlet /> ;
}

export default ProtectedRoute;