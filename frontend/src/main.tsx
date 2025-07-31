import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ApolloProvider} from "@apollo/client";
import {client} from "./graphql/client.ts";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ApolloProvider client={client}>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </ApolloProvider>
    </StrictMode>,
);