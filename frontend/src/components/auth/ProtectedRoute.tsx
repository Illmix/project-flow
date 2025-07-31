import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../../hooks/useAuth.ts";
import Spinner from "../ui/Spinner.tsx";

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Outlet />;
    }

    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;