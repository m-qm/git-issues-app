// src/index.tsx (or the file where your app is initialized)
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/GitHubIssues';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { accessToken } from './config';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql', // Update with your proxy server URL
  cache: new InMemoryCache(),
  headers: {
    Authorization: `bearer ${accessToken}`,
  },
});

const container = document.getElementById('app');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
