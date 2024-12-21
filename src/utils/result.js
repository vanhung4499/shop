const ResultCode = require('../common/constants/result-code');
const result = {
  success(data = null) {
    return {
      code: ResultCode.SUCCESS.code,
      msg: ResultCode.SUCCESS.message,
      data,
    };
  },
  fail(code, msg, data = null) {
    return {
      code,
      msg,
      data,
    };
  },
};

module.exports = result;
