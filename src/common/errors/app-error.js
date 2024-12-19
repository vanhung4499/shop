class AppError extends Error {
  constructor(code, message, stack = '') {
    super(message);
    this.code = code;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = AppError;
