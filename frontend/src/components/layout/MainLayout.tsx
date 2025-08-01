import { Outlet } from 'react-router-dom';
import {useAuth} from "../../hooks/useAuth.ts";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
    <header className="p-4 shadow-sm shadow-gray-500 w-screen z-10 flex justify-between items-center mb-3">
        <div>
            <h1 className="text-3xl font-bold text-white">
                Welcome, {user?.Name}!
            </h1>
            {user?.Position && <p className="text-slate-300">{user.Position}</p>}
        </div>
        <button
            onClick={logout}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
            Logout
        </button>
    </header>
)};

const MainLayout = () => {
    return (
        <div className="flex flex-col w-full h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;