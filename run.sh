#!/bin/bash

# The clientID and secret from apps.zendesk.com
# https://developer.zendesk.com/documentation/marketplace/building-a-marketplace-bot/request-bot-oauth-credentials/
export OAUTH_CLIENT_ID="your_bot_here"
export OAUTH_CLIENT_SECRET="secret"
export ZENDESK_MARKETPLACE_NAME="your_app_name"
export ZENDESK_MARKETPLACE_ORG_ID="your_org_id"
export ZENDESK_MARKETPLACE_APP_ID="your_marketplace_bot_id"
export ZENDESK_DOMAIN="zendesk.com"
export PORT=3000

node server.js
