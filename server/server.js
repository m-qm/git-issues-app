const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(
  '/graphql',
  createProxyMiddleware({
    target: 'https://api.github.com',
    changeOrigin: true,
    pathRewrite: {
      '^/graphql': '', // remove the /graphql prefix when forwarding
    },
  })
);

app.listen(3001, () => {
  console.log('Proxy server listening on port 3001');
});
