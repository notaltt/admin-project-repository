// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Panel from './Panel';

const PrivateRoute = () => {
  const { currentUser } = useAuth();

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return currentUser ? <Panel /> : <Navigate to="/" />;
};

export default PrivateRoute;
