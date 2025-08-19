const requiredVars = [
  'OAUTH_CLIENT_ID',
  'OAUTH_CLIENT_SECRET',
  'ZENDESK_MARKETPLACE_NAME',
  'ZENDESK_MARKETPLACE_APP_ID',
  'ZENDESK_MARKETPLACE_ORG_ID',
];

const missingVars = requiredVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
}

const zendeskDomain = process.env.ZENDESK_DOMAIN || 'zendesk.com';
const config = {
  oauthClientId: process.env.OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
  zendeskMarketplaceName: process.env.ZENDESK_MARKETPLACE_NAME,
  zendeskMarketplaceAppId: process.env.ZENDESK_MARKETPLACE_APP_ID,
  zendeskMarketplaceOrgId: process.env.ZENDESK_MARKETPLACE_ORG_ID,
  zendeskDomain,
  oauthBaseUrl: `https://oauth-bridge.${zendeskDomain}/sc`,
};

module.exports = config;
