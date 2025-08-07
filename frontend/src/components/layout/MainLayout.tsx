import { Outlet } from 'react-router-dom';
import {useAuth} from "../../hooks/useAuth.ts";
import {Toaster} from "react-hot-toast";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
    <header className="p-4 shadow-sm shadow-gray-500 w-screen z-10 flex justify-between items-center">
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
        <div className="min-h-screen flex flex-col w-full">
            <Navbar />
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#2a2a3a',
                        color: '#e2e8f0',
                        border: '1px solid #475569',
                    },
                    success: {
                        iconTheme: {
                            primary: '#34d399',
                            secondary: '#1f2937',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#f87171',
                            secondary: '#1f2937',
                        },
                    },
                }}
            />
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;