const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

const config = require('./config');
const smoochApi = require('./smoochApi');
const { extractAppId } = require('./tokenUtils');
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

app.get('/', (req, res) => {
  res.renderMain('addToSunshineConversations', config);
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

/**
 * Exchanges an authorization code, yields an access token.
 */
function exchangeCode(code) {
  const {suncoBaseUrl, oauthClientId, oauthClientSecret} = config;
  return fetch(`${suncoBaseUrl}/oauth/token`, {
      method: 'POST',
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: oauthClientId,
        client_secret: oauthClientSecret,
      }),
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(({ access_token }) => access_token)
}

app.get('/exchange', (req, res) => {
  let token;

  exchangeCode(req.query.code)
    .then((exchangedCode) => {
      token = exchangedCode;
      return smoochApi.sendTestMessage(token);
    })
    .then((appUser) => {
      const appId = extractAppId(token);
      console.log(`Integration with App ID ${appId} successful!`);
      res.renderMain('success', {
        appUser,
        url: `${config.suncoBaseUrl}/apps/${appId}/${config.oauthClientId}`,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('An unexpected error occurred');
    });
});

app.get('/settings', (req, res) => {
  res.renderMain('settings');
});

app.post('/remove', (req, res) => {
  console.log(
    `The integration with ID ${req.body.integrationId} has been been removed!`
  );
  res.end();
});

app.listen(process.env.PORT || 3000);
console.log(`App listening on ${process.env.PORT || 3000}`);
