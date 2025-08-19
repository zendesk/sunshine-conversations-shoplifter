require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');

const config = require('./config');
const { exchangeCode, createMessagingApi } = require('./zendeskApi');
const app = express();

app.disable('x-powered-by');
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.renderMain = (view, props) => {
    props = props || {};
    props.layout = 'main';
    res.render(view, props);
  };
  next();
});

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json()),
    expressFormat: true,
  }),
);

app.get('/', (req, res) => {
  res.renderMain('addToSunshineConversations', {
    oauthAuthorizeUrl: `${config.oauthBaseUrl}/oauth/authorize`,
    oauthClientId: config.oauthClientId,
  });
});

app.get('/oauth', (req, res) => {
  if (req.query.error) {
    return res.renderMain('error', {
      error: req.query.error,
    });
  } else {
    const props = config;
    props.code = req.query.code;
    return res.renderMain('exchangeToken', props);
  }
});

app.get('/exchange', async (req, res) => {
  const token = await exchangeCode(req.query.code);
  const messagingApi = await createMessagingApi(token);
  const { id: appId, subdomain } = messagingApi.app;

  const user = await messagingApi.getOrCreateUser('shoplifter_sample_user');
  const conversation = await messagingApi.getOrCreateConversation(user.id);
  await messagingApi.sendMessage(conversation.id, {
    author: {
      type: 'user',
      userId: user.id,
    },
    content: {
      type: 'text',
      text: 'You have successfully integrated Shoplifter!',
    },
  });

  res.renderMain('success', {
    appId,
    subdomain,
    user,
    settingsUrl: `https://${subdomain}.${config.zendeskDomain}/admin/ai/ai-agents/ai-agents/marketplace-bots`,
  });
});

app.post('/remove', (req, res) => {
  console.log(
    `The integration with ID ${req.body.integrationId} has been been removed!`,
  );
  res.end();
});

app.listen(process.env.PORT || 3000);
console.log(`App listening on ${process.env.PORT || 3000}`);
