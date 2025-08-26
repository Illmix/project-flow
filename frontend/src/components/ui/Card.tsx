import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-gray-800 border border-slate-700 rounded-lg shadow-lg p-6 ${className}`}>
            {children}
        </div>
    );
};

export default Card;