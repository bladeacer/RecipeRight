import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem("accessToken");
    const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

    if (!token || user?.role !== role) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
