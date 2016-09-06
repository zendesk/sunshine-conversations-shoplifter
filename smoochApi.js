const Smooch = require('smooch-core');

const config = require('./config');

/**
 * Yields a test app user, creates one if necessary.
 */
function getOrCreateUser(smooch) {
    const userId = 'test@shoplifter.com';

    return smooch.appUsers.get(userId)
        .catch((err) => {
            if (!err.response || err.response.status !== 404) {
                throw err;
            }

            return smooch.appUsers.create(userId, {
                givenName: 'Shoplifter'
            });
        })
        .then((response) => {
            return response;
        })
}

/**
 * Creates an app user and sends a test message using the retrieved token
 */
module.exports.sendTestMessage = function(token) {
    let appUser;
    const smooch = new Smooch({
        jwt: token
    }, {
        serviceUrl: config.smoochBaseUrl + '/v1'
    });

    return getOrCreateUser(smooch)
        .then((response) => {
            appUser = response.appUser;
            return smooch.appUsers.sendMessage(appUser.userId, {
                text: 'You\'ve successfully integrated Shoplifter!',
                role: 'appUser'
            });
        })
        .then(() => {
            return appUser;
        });
}
