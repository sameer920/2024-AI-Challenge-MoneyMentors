

const cors = require('cors');
const express = require('express');

const { app } = require('./server');
const {router} = require('../routes/routes.js')
const setUpAuth = require('./auth')
const train = require('../routes/train')
const auth = require('../routes/authentication')

app.use(express.static('icons'))
app.use(express.static('./clientfrontEnd/dist'));
app.use(express.static('./clientfrontEnd/src/JS'))
app.use(express.static('./clientfrontEnd/src'))


app.set('trust proxy', 1)
app.use(
    cors({
        credentials: true,
        // origin: frontEndPath,
        origin: function (origin, callback) {
            return callback(null, true);
        },
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]
    }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));


setUpAuth(app)
app.use('/', router);
app.use('/train', train);
app.use('/auth', auth);

module.exports = app;