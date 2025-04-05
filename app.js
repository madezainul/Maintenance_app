'use strict'
const express = require('express'),
      session = require('cookie-session'),
      flash = require('express-flash'),
      fileupload = require('express-fileupload'),
      createError = require('http-errors'),
      path = require('path'),
      ejs = require('ejs-mate'),
      logger = require('morgan'),
      dotenv = require('dotenv'),
      {Run} = require('./config/www'),
      app = express();

app.use(express.static(path.join(__dirname, 'static')));

dotenv.config();

app.set('trust proxy', 1);
app.engine('html', ejs)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'app/views'))

app.use(fileupload({
    createParentPath: true
}));

app.use(session({
    secret: process.env.SECRET_KEY,
    name: 'apiccookie',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 6000000
    }
}));

app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('./config/route'));

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

Run(app);