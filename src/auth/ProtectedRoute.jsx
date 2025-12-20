import React from 'react'
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');;
    if (!token) {
        return <Navigate to='/login-user' replace />
    }
    return children;
}

export default ProtectedRoute