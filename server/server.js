const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(
  '/graphql',
  createProxyMiddleware({
    target: 'https://api.github.com',
    changeOrigin: true,
    pathRewrite: {
      '^/graphql': '', // remove the /graphql prefix when forwarding
    },
    // Add any other proxy options as needed
  })
);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
