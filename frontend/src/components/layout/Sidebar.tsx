import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, Wrench } from 'lucide-react';
import {ElementType} from "react";

type NavLinkItem = {
    to: string;
    icon: ElementType;
    label: string;
};

const navLinks: NavLinkItem[] = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/employees', icon: Users, label: 'Employees' },
    { to: '/skills', icon: Wrench, label: 'Skills' },
];

const Sidebar = () => {
    const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-200 ${
            isActive
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200' 
        }`;

    return (
        <aside className="w-64 flex-shrink-0 bg-slate-800 p-4 flex flex-col">
            <div className="text-2xl font-bold text-white mb-6 ml-2">
                ProjectFlow
            </div>
            <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={getNavLinkClass}
                    >
                        <link.icon size={20} />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;