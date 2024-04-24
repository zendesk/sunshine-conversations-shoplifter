#!/bin/bash

# A simple run script for local development.

# The base URL for Sunco 
export SUNCO_BASE_URL="https://app.smooch.io"

# The oauthClientId of a document in MongoDB's `oauthclients` collection.
export OAUTH_CLIENT_ID="your_bot_here"

# It turns out this is not used. Instead the code uses views/addToSunshineConversations.ejs:
export OAUTH_REDIRECT_URL="https://app.smooch.io/oauth/authorize"

# The plaintext version of the your oauth client secret.
export OAUTH_CLIENT_SECRET="secret"

# Override the default port value (3000) here if you need to.
export PORT=3000

node server.js
