#!/bin/bash

# A simple run script for local development.
# Follow instructions at in the Advanced Dev Setup Guide: OAuth Integrations: Testing Locally:
# https://docs.google.com/document/d/1ZuAHnPSYdmmFAgiQWLUsQa6k7iv3ZY_sxah7Qx4u3-M/edit#heading=h.ziahl5mf8p0p
# After you have created an oauthclient with the name of your choice, update the CLIENT_ID below to match it.
# You can set the port that Shoplifter will listen on by modifying the PORT env var below. Then run this
# script and connect to localhost:PORT in your web browser.

# The base URL for Sunco running in ZDI.
export SMOOCH_BASE_URL="https://sunco.zd-dev.com"
# Change the SunCo base URL to localhost:<port> or an
# ngrok URL if running sunco locally but not in ZDI.
# eg. export SMOOCH_BASE_URL="http://localhost:8091"

# The clientId of a document in MongoDB's `oauthclients` collection.
export CLIENT_ID="your_bot_here" 

# It turns out this is not used. Instead the code uses views/addToSunshineConversations.ejs:
# "<%= smoochBaseUrl %>/oauth/authorize?client_id=<%= clientId %>&response_type=code"
export REDIRECT_URL="https://sunco.zd-dev.com/oauth/authorize" 

# The plaintext version of the encrypted value in mongodb oauthclients. Literally "secret" if you follow
# the Advanced Dev Setup Guide and do a copy/paste into your MongoDB's oauthclients collection.
export SECRET="secret" 

# Override the default port value (3000) here if you need to.
export PORT=3000

node server.js
