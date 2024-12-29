const express = require('express');
const { paymentController } = require('../../controllers');

const router = express.Router();

router.post('/result', paymentController.paymentResult);

module.exports = router;
