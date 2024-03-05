const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const request = require('request');

const config = require('./config');
const smoochApi = require('./smoochApi');
const { extractAppId } = require('./tokenUtils');
const app = express();

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
  return new Promise((resolve, reject) => {
    request.post(
      `${config.smoochBaseUrl}/oauth/token`,
      {
        form: {
          code: code,
          grant_type: 'authorization_code',
          client_id: config.clientId,
          client_secret: config.secret,
        },
      },
      (err, http, body) => {
        if (err) {
          return reject(err);
        }

        try {
          const { access_token } = JSON.parse(body);
          resolve(access_token);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
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
        url: `${config.smoochBaseUrl}/apps/${appId}/${config.clientId}`,
      });
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
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
