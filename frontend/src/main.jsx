import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { AuthProvider } from './context/AuthContext.jsx';

// CHANGE THIS: Use a relative path.
// Vite will see '/graphql' and proxy it to port 8080.
const httpLink = new HttpLink({
    uri: '/graphql',
    credentials: 'include'
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </AuthProvider>
    </React.StrictMode>,
)
