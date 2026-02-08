import React from 'react'
import './index.css'
import App from './App.jsx'
import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { createRoot } from 'react-dom/client'

const httpLink = 'http://localhost:8080/graphql';

const client = new ApolloClient({
    link: new HttpLink({uri: httpLink}), // Springboot backend
    cache: new InMemoryCache(), // Caches results - no unnecessary re-fetch
})

// Wrap the App
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ApolloProvider client={client}>
          <App />
      </ApolloProvider>
  </React.StrictMode>,
)
