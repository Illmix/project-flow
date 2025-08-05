import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../../hooks/useAuth.ts";
import Spinner from "../ui/Spinner.tsx";

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return (
            <div className="flex justify-center w-screen mt-20"><Spinner className={"w-10 h-10"} /></div>
        );


    if (isAuthenticated) {
        return <Outlet />;
    }

    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;