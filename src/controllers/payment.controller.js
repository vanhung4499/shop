const catchAsync = require('../utils/catch-async');
const { paymentService } = require('../services');
const result = require('../utils/result');

const paymentResult = catchAsync(async (req, res) => {
  await paymentService.paymentResult(req.body);

  res.send(result.success());
});

module.exports = {
  paymentResult,
};
