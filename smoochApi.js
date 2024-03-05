const SunshineConversationsClient = require('sunshine-conversations-client');

const config = require('./config');
const { extractAppId } = require('./tokenUtils');

/**
 * Yields a test app user, creates one if necessary.
 */
function getOrCreateUser(appId) {
  const userId = 'test@shoplifter.com';
  const apiInstance = new SunshineConversationsClient.UsersApi();

  return apiInstance
    .getUser(appId, userId)
    .catch((err) => {
      if (!err.response || err.response.status !== 404) {
        throw err;
      }

      const userCreateBody = new SunshineConversationsClient.UserCreateBody(
        userId
      );
      userCreateBody.setProfile({ givenName: 'Shoplifter' });

      return apiInstance.createUser(appId, userCreateBody);
    })
    .then((response) => {
      return response;
    });
}

/**
 * Yields a test conversation, creates one if necessary.
 */
function getOrCreateConversation(appId, userId) {
  const apiInstance = new SunshineConversationsClient.ConversationsApi();
  const filter =
    new SunshineConversationsClient.ConversationListFilter.constructFromObject({
      userId,
    });

  return apiInstance
    .listConversations(appId, filter)
    .then(({ conversations }) => {
      if (conversations.length > 0) {
        return Promise.resolve({ conversation: conversations[0] });
      }

      const conversationCreateBody =
        new SunshineConversationsClient.ConversationCreateBody.constructFromObject(
          {
            type: 'personal',
            participants: [{ userId }],
          }
        );

      return apiInstance.createConversation(appId, conversationCreateBody);
    })
    .then(({ conversation }) => {
      return conversation;
    });
}

/**
 * Creates an app user and sends a test message using the retrieved token
 */
module.exports.sendTestMessage = function (token) {
  let appUser;
  const appId = extractAppId(token);

  const defaultSuncoClient = SunshineConversationsClient.ApiClient.instance;
  defaultSuncoClient.authentications['bearerAuth'].accessToken = token;
  defaultSuncoClient.basePath = config.smoochBaseUrl;

  return getOrCreateUser(appId)
    .then((response) => {
      appUser = response.user;

      return getOrCreateConversation(appId, appUser.id);
    })
    .then((conversation) => {
      const apiInstance = new SunshineConversationsClient.MessagesApi();
      const messagePost =
        new SunshineConversationsClient.MessagePost.constructFromObject({
          author: {
            type: 'user',
            userId: appUser.id,
          },
          content: {
            type: 'text',
            text: "You've successfully integrated Shoplifter!",
          },
        });

      return apiInstance.postMessage(appId, conversation.id, messagePost);
    })
    .then(() => {
      return appUser;
    });
};
