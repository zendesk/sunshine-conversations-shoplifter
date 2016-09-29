const _ = require('lodash');

let config = {
  smoochBaseUrl: process.env.SMOOCH_BASE_URL,
  clientId: process.env.CLIENT_ID,
  redirectUrl: process.env.REDIRECT_URL,
  secret: process.env.SECRET
}

try {
  config = _.defaults(config, require('./config/config.json'));
} catch (e) {
  // do nothing
}

config = _.defaults(config, require('./config/default/config.json'));

console.log('Server Configuration:\n', config);

if (!config.secret || !config.redirectUrl || !config.clientId) {
  throw new Error('Missing environment variable. Please ensure the following are set: CLIENT_ID, SECRET, REDIRECT_URL');
}

module.exports = config;
