#!/bin/bash

# A simple run script for local development.

# The base URL for Sunshine Conversations
export SUNCO_BASE_URL="https://app.smooch.io"

# The clientID and secret from apps.zendesk.com
# https://developer.zendesk.com/documentation/marketplace/building-a-marketplace-bot/request-bot-oauth-credentials/
export OAUTH_CLIENT_ID="your_bot_here"
export OAUTH_CLIENT_SECRET="secret"

# Override the default port value (3000) here if you need to.
export PORT=3000

node server.js
