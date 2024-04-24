const _ = require('lodash');

let config = {
  suncoBaseUrl: process.env.SUNCO_BASE_URL,
  oauthClientId: process.env.OAUTH_CLIENT_ID,
  oauthRedirectUrl: process.env.OAUTH_REDIRECT_URL,
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
};

try {
  config = _.defaults(config, require('./config/config.json'));
} catch (e) {
  // do nothing
}

config = _.defaults(config, require('./config/default/config.json'));

if (!config.suncoBaseUrl || !config.oauthClientSecret || !config.oauthRedirectUrl || !config.oauthClientId) {
  for (const key in config) {
    console.log(key, typeof config[key])
  }
  throw new Error('Missing environment variable. Please ensure the following are set: SUNCO_BASE_URL, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URL');
}

module.exports = config;
