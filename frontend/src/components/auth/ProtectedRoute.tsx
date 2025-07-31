import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('authToken');

    // If a token exists, render the nested child routes.
    // Otherwise, redirect to the login page.
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;