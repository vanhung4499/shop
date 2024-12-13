const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const {authValidation} = require('../../validations');
const {authController} = require('../../controllers');

const router = express.Router();

router.post('/login', validate(authValidation.login), authController.login);
router.post('/register', validate(authValidation.register), authController.register);
router.post('/logout', auth(), authController.logout);

module.exports = router;
