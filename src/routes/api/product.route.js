const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { productValidation } = require('../../validations');
const { productController } = require('../../controllers');
const RoleEnum = require('../../common/enums/role.enum');
const { getProduct } = require('../../controllers/product.controller');

const router = express.Router();

router
  .route('/')
  .get(validate(productValidation.getProducts), productController.getProducts)
  .post(
    auth(RoleEnum.ADMIN),
    validate(productValidation.createProduct),
    productController.createProduct,
  );

router
  .route('/:productId')
  .get(validate(productValidation.getProduct), productController.getProduct)
  .patch(
    auth(RoleEnum.ADMIN),
    validate(productValidation.updateProduct),
    productController.updateProduct,
  )
  .delete(
    auth(RoleEnum.ADMIN),
    validate(productValidation.deleteProduct),
    productController.deleteProduct,
  );

module.exports = router;
