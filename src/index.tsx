// src/index.tsx (or the file where your app is initialized)
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/GitHubIssues';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { accessToken } from './config';

import 'bootstrap/dist/css/bootstrap.min.css';

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${accessToken}`,
  },
});


const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});


const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
