import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  // Render a gorgeous emerald loading spinner during active session recoveries
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="relative flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin"></div>
          <span className="mt-4 text-slate-400 font-outfit text-sm tracking-wider animate-pulse">Loading green spaces...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if user session is absent
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Enforce ADMIN role if required
  if (adminOnly && user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
