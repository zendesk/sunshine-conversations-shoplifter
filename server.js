const express = require('express');
const ejs = require('ejs');
const ejsLocals = require('ejs-locals');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const config = require('./config');

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

app.listen(process.env.PORT || 3000);
