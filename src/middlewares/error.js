const mongoose = require("mongoose");
const AppError = require("../utils/app-error");
const config = require("../config/config");
const httpStatus = require('http-status');
const logger = require("../config/logger");

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof AppError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new AppError(statusCode, message, err.stack);
  }
  next(error);
}

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (config.env === 'production') {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};


module.exports = {
  errorConverter,
  errorHandler,
};
