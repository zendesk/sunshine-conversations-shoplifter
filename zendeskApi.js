const path = require('path');
const config = require('./config');

async function exchangeCode(code) {
  const { oauthBaseUrl, oauthClientId, oauthClientSecret } = config;
  const oauthTokenUrl = `${oauthBaseUrl}/oauth/token`;

  const response = await fetch(oauthTokenUrl, {
    method: 'POST',
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: oauthClientId,
      client_secret: oauthClientSecret,
    }),
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    console.log(response);
    throw new Error(
      `Failed to exchange oauth code for access token: ${response.status}`,
    );
  }

  const { access_token } = await response.json();
  return access_token;
}

async function getTokenInfo(token) {
  const tokenInfoUrl = `${config.oauthBaseUrl}/v2/tokeninfo`;
  const response = await fetch(tokenInfoUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error(
      `getTokenInfo failed ${response.status} ${response.statusText}`,
    );
  }
}

async function createMessagingApi(token) {
  const tokenInfo = await getTokenInfo(token);
  return new MessagingApi(token, tokenInfo);
}

class MessagingApi {
  constructor(token, tokenInfo) {
    this.token = token;
    this.app = tokenInfo.app;
    this.appBasePath = path.join(
      `https://${this.app.subdomain}.${config.zendeskDomain}/sc/v2/apps/${this.app.id}`,
    );
  }

  async authenticatedRequest(method, endpoint, body) {
    const url = path.join(this.appBasePath, endpoint);
    console.log(`Making ${method} request to: ${url}`);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.ok) {
      return response.json();
    } else {
      const error = new Error(
        `${method} ${endpoint} failed ${response.status} ${response.statusText}`,
      );
      error.status = response.status;
      throw error;
    }
  }

  async getOrCreateUser(externalId) {
    try {
      const { user } = await this.authenticatedRequest(
        'GET',
        `users/${externalId}`,
      );
      return user;
    } catch (err) {
      if (err.status !== 404) {
        throw err;
      }

      const { user } = await this.authenticatedRequest('POST', 'users', {
        externalId,
        profile: { givenName: 'Shoplifter' },
      });
      return user;
    }
  }

  async getOrCreateConversation(userId) {
    const { conversations } = await this.authenticatedRequest(
      'GET',
      `conversations?filter[userId]=${userId}`,
    );

    if (conversations.length > 0) {
      return conversations[0];
    } else {
      const { conversation } = await this.authenticatedRequest(
        'POST',
        'conversations',
        {
          type: 'personal',
          participants: [{ userId }],
        },
      );
      return conversation;
    }
  }

  async sendMessage(conversationId, message) {
    const { messages } = await this.authenticatedRequest(
      'POST',
      `conversations/${conversationId}/messages`,
      message,
    );

    return messages;
  }
}

module.exports = { exchangeCode, createMessagingApi };
