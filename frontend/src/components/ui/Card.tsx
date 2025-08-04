import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-6 ${className}`}>
            {children}
        </div>
    );
};

export default Card;