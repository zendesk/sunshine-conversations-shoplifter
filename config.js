const config = {
  ...require('./config/default/config.json'),
  suncoBaseUrl: process.env.SUNCO_BASE_URL,
  oauthClientId: process.env.OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
};

if (
  !config.suncoBaseUrl ||
  !config.oauthClientSecret ||
  !config.oauthClientId
) {
  for (const key in config) {
    console.log(key, typeof config[key]);
  }
  throw new Error(
    'Missing environment variable. Please ensure the following are set: SUNCO_BASE_URL, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URL',
  );
}

module.exports = config;
