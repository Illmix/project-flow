import {createContext, ReactNode, useMemo, useState} from 'react';
import {useApolloClient, useQuery} from '@apollo/client';
import { ME_QUERY } from '../graphql/queries/employeeQueries';
import { MeQuery } from '../types/graphql';
import {useNavigate} from "react-router-dom";

interface AuthContextType {
    user: MeQuery['me'] | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
    const client = useApolloClient();
    const navigate = useNavigate();

    const { data, loading } = useQuery<MeQuery>(ME_QUERY, {
        skip: !token,
        onError: () => {
            // If the token is invalid, log the user out
            logout();
        },
    });

    const login = (newToken: string) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        client.resetStore(); // Clear the Apollo cache
        navigate('/login');
    };

    const contextValue = useMemo(() => {
        const user = data?.me || null;
        const isAuthenticated = !!user;

        return { user, loading, isAuthenticated, login, logout };
    }, [data, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
