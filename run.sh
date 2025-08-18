#!/bin/bash

# The clientID and secret from apps.zendesk.com
# https://developer.zendesk.com/documentation/marketplace/building-a-marketplace-bot/request-bot-oauth-credentials/
export OAUTH_CLIENT_ID="your_bot_here"
export OAUTH_CLIENT_SECRET="secret"
export ZENDESK_DOMAIN="zendesk.com"
export PORT=3000

node server.js
