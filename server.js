const express = require('express');
const ejs = require('ejs');
const ejsLocals = require('ejs-locals');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const request = require('request');

const config = require('./config');
const smoochApi = require('./smoochApi');
const app = express();

app.engine('ejs', ejsLocals);
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
    }
    next();
});

app.get('/', (req, res) => {
    res.renderMain('addToSmooch', config);
});

app.get('/oauth', (req, res) => {
    if (req.query.error) {
        return res.renderMain('error', {
            error: req.query.error
        });
    } else {
        const props = config;
        props.code = req.query.code;
        return res.render('exchangeToken', props);
    }
})

/**
 * Exchanges an authorization code, yields an access token.
 */
function exchangeCode(code) {
    return new Promise((resolve, reject) => {
        request.post(`${config.smoochBaseUrl}/oauth/token`, {
            form: {
                code: code,
                grant_type: 'authorization_code',
                client_id: config.clientId,
                client_secret: config.secret
            }
        }, (err, http, body) => {
            if (err) {
                return reject(err);
            }

            try {
                const {access_token} = JSON.parse(body);
                resolve(access_token);
            }
            catch (err) {
                reject(err);
            }
        });
    });
}

app.get('/exchange', (req, res) => {
    exchangeCode(req.query.code)
        .then((token) => smoochApi.sendTestMessage(token))
        .then((appUser) => {
            res.send(`Success! An access token received and a test message was sent for userId ${appUser.userId}`);
        })
        .catch((err) => {
            console.error(err);
            res.send(err);
        })
})

app.listen(process.env.PORT || 3000);
