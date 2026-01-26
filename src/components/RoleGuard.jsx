import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RoleGuard({ allow = [], children }) {
  const { user } = useAuth();

  if (!user) return null; // ProtectedRoute handles redirect
  if (!allow.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
