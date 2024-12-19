const mongoose = require('mongoose');
const AppError = require('../common/errors/app-error');
const config = require('../config/config');
const httpStatus = require('http-status');
const logger = require('../config/logger');
const { BizError } = require('../common/errors');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof AppError) && !(error instanceof BizError)) {
    const code =
      error.code || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[code];
    error = new AppError(code, message, err.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { code, message } = err;

  if (config.env === 'production') {
    code = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  // Get status code by error code,
  // if code < 1000 then it's a http status code, return it
  // if code >= 30000 then it's an infrastructure error, return http status internal server error
  // otherwise error is a biz error, return http status bad request
  let statusCode =
    code >= 30000
      ? httpStatus.INTERNAL_SERVER_ERROR
      : code >= 10000
        ? httpStatus.BAD_REQUEST
        : code;

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
