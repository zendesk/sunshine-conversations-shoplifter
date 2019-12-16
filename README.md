# Shoplifter

A reference implementation of Sunshine Conversations OAuth flows. A working example can be found at https://shoplifter.herokuapp.com.

# How to use

1. Install node modules: `npm install`
1. Run the server `node server.js`

# Configuration

Set the following environment variables to configure the app to target your OAuth Client:

```bash
set CLIENT_ID <your_client_id>
set REDIRECT_URL <your_redirect_url>
set SECRET <your_secret>
```

```bash
set NODE_ENV production
```
