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

app.get('/', (req, res) => {
    res.render('addToSmooch', Object.assign(config, {
        layout: 'main'
    }));
});

app.get('/oauth', (req, res) => {
    res.render('exchangeToken', Object.assign(config, {
        layout: 'main',
        code: req.query.code
    }));
})

app.listen(process.env.PORT || 3000);
