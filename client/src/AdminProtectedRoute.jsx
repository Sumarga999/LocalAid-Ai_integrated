import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminProtectedRoute({ children }) {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // If there is no user, or the user is NOT an admin, kick them to the login screen
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // If they are an admin, let them pass!
  return children;
}

export default AdminProtectedRoute;