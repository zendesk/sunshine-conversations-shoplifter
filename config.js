const _ = require('lodash');

const config = {
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
    redirectUrl: 'https://shoplifter.herokuapp.com/oauth',
    secret: 'secret'
}

if (process.env.NODE_ENV === 'production') {
    module.exports = _.defaults(production, config);
} else {
    module.exports = _.defaults(development, config);
}
