import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
