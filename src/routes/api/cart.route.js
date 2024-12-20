const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { cartValidation } = require('../../validations');
const { cartController } = require('../../controllers');
const RoleEnum = require('../../common/enums/role.enum');

const router = express.Router();

router
  .route('/')
  .get(auth(RoleEnum.CUSTOMER), cartController.getCart)
  .post(
    auth(RoleEnum.CUSTOMER),
    validate(cartValidation.addCartItem),
    cartController.addCartItem,
  )
  .delete(auth(RoleEnum.CUSTOMER), cartController.deleteCart);

router
  .route('/:itemId')
  .patch(
    auth(RoleEnum.CUSTOMER),
    validate(cartValidation.updateCartItem),
    cartController.updateCartItem,
  )
  .delete(
    auth(RoleEnum.CUSTOMER),
    validate(cartValidation.removeCartItem),
    cartController.removeCartItem,
  );

module.exports = router;
