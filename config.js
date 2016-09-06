const _ = require('lodash');

let config = {
    smoochBaseUrl: process.env.SMOOCH_BASE_URL,
    clientId: process.env.CLIENT_ID,
    redirectUrl: process.env.REDIRECT_URL,
    secret: process.env.SECRET
}

const development = {
    smoochBaseUrl: 'http://localhost:8091',
    clientId: 'shoplifter',
    redirectUrl: 'http://localhost:3000/oauth',
    secret: 'secret'
}

const production = {
    smoochBaseUrl: 'https://app.smooch.io',
    clientId: 'shoplifter',
    redirectUrl: 'https://shoplifter.herokuapp.com/oauth'
}

if (process.env.NODE_ENV === 'production') {
    config = _.defaults(config, production);
} else {
    config = _.defaults(config, development);
}

if (!config.secret) {
    throw new Error('Missing environment variable: SECRET');
}

module.exports = config;
