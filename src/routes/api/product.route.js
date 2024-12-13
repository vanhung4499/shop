const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { productValidation } = require('../../validations');
const { productController } = require('../../controllers');

const router = express.Router();

// router.route('/')
//   .get(auth(), productController.getAllProducts)
//   .post(auth('admin'), validate(productValidation.createProduct), productController.createProduct);
//
// router.route('/:productId')
//   .get(auth(), productController.getProductById)
//   .put(auth('admin'), validate(productValidation.updateProduct), productController.updateProduct)
//   .delete(auth('admin'), productController.deleteProduct);

module.exports = router;