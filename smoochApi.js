const SunshineConversationsClient = require('sunshine-conversations-client');

const config = require('./config');
const {extractAppId} = require("./TokenUtils");

/**
 * Yields a test app user, creates one if necessary.
 */
function getOrCreateUser(appId) {
  const userId = 'test@shoplifter.com';
  const apiInstance = new SunshineConversationsClient.UsersApi();

  return apiInstance.getUser(appId, userId)
    .catch((err) => {
      if (!err.response || err.response.status !== 404) {
        throw err;
      }

      const userCreateBody = new SunshineConversationsClient.UserCreateBody({
        externalId: userId,
        profile: {givenName: 'Shoplifter'}
      });
      return apiInstance.createUser(appId, userCreateBody);
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
  const appId = extractAppId(token);

  const defaultSuncoClient = SunshineConversationsClient.ApiClient.instance;
  defaultSuncoClient.authentications['bearerAuth'].accessToken = token;
  defaultSuncoClient.basePath = config.smoochBaseUrl

  return getOrCreateUser(appId)
    .then((response) => {
      appUser = response.user;

      return new SunshineConversationsClient.MessagePost(appUser.id, {
        text: 'You\'ve successfully integrated Shoplifter!',
        role: 'appUser'
      });
    })
    .then(() => {
      return appUser;
    });
}
