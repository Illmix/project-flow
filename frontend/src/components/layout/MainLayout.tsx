import { Outlet } from 'react-router-dom';
import {useAuth} from "../../hooks/useAuth.ts";
import {Toaster} from "react-hot-toast";
import Sidebar from "./Sidebar.tsx";

const Header = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <header className="p-4 bg-slate-800 border-b border-slate-700/80 z-10 flex justify-between items-center">
            <div className="flex-1">

            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-semibold text-slate-200">{user.Name}</p>
                    <p className="text-sm text-slate-400">{user.Position}</p>
                </div>
                <button
                    onClick={logout}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

const MainLayout = () => {
    return (
        <div className="min-h-screen min-w-screen flex">

            <Sidebar />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />

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

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
export default MainLayout;