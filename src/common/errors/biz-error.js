class BizError extends Error {
  constructor(resultCode, stack = '') {
    super(resultCode.message);
    this.code = resultCode.code;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = BizError;
