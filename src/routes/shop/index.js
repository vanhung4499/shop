const express = require('express');
const { shopController } = require('../../controllers');
const router = express.Router();

router.get('/login', shopController.getLoginPage);
router.get('/register', shopController.getRegisterPage);

module.exports = router;
