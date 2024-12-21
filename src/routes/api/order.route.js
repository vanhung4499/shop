const express = require('express');
const auth = require('../../middlewares/auth');
const RoleEnum = require('../../common/enums/role.enum');
const validate = require('../../middlewares/validate');
const { orderValidation } = require('../../validations');
const { orderController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth(), validate(orderValidation.getOrders), orderController.getOrders)
  .post(
    auth(RoleEnum.CUSTOMER),
    validate(orderValidation.createOrder),
    orderController.createOrder,
  );

router.post(
  '/pay',
  auth(RoleEnum.CUSTOMER),
  validate(orderValidation.payment),
  orderController.payOrder,
);
router.post(
  '/cancel',
  auth(RoleEnum.CUSTOMER),
  validate(orderValidation.cancelOrder),
  orderController.cancelOrder,
);

router
  .route('/:orderId')
  .get(auth(), validate(orderValidation.getOrder), orderController.getOrder)
  .delete(
    auth(RoleEnum.ADMIN),
    validate(orderValidation.deleteOrder),
    orderController.deleteOrder,
  );

module.exports = router;
