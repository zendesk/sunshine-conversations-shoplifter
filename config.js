const zendeskDomain = process.env.ZENDESK_DOMAIN || 'zendesk.com';
const config = {
  oauthClientId: process.env.OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
  zendeskDomain,
  oauthBaseUrl: `https://oauth-bridge.${zendeskDomain}/sc`,
};

if (!config.oauthClientId || !config.oauthClientSecret) {
  for (const key in config) {
    console.log(key, typeof config[key]);
  }
  throw new Error(
    'Missing environment variable. Please ensure the following are set: OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET',
  );
}

module.exports = config;
