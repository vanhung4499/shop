const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const passport = require('passport');
const httpStatus = require('http-status');
const { jwtStrategy } = require('./config/passport');

const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middlewares/error');
const AppError = require('./common/errors/app-error');

const app = express();

// setup public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(new AppError(httpStatus.NOT_FOUND, 'Not found'));
});

// Convert error to AppError, if needed
app.use(errorConverter);

// error handler
app.use(errorHandler);

module.exports = app;
