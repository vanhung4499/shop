const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { productValidation, userValidation } = require('../../validations');
const RoleEnum = require('../../common/enums/role.enum');
const { userController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth(RoleEnum.ADMIN), userController.getUsers)
  .post(
    auth(RoleEnum.ADMIN),
    validate(userValidation.createUser),
    userController.createUser,
  );

router
  .route('/:userId')
  .get(
    auth(RoleEnum.ADMIN),
    validate(userValidation.getUser),
    userController.getUser,
  )
  .patch(
    auth(RoleEnum.ADMIN),
    validate(userValidation.updateUser),
    userController.updateUser,
  )
  .delete(
    auth(RoleEnum.ADMIN),
    validate(userValidation.deleteUser),
    userController.deleteUser,
  );

module.exports = router;
