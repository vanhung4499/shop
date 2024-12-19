const express = require('express');
const shopRoute = require('./shop');
const adminRoute = require('./admin');
const apiRoute = require('./api');

const router = express.Router();

router.use('/api', apiRoute);
router.use('', shopRoute);
router.use('/admin', adminRoute);

module.exports = router;
