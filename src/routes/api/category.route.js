const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { categoryController} = require('../../controllers');
const RoleEnum = require("../../common/enums/role.enum");
const {categoryValidation} = require("../../validations");

const router = express.Router();

router.route('/')
  .get(categoryController.getCategories)
  .post(auth(RoleEnum.ADMIN), validate(categoryValidation.createCategory), categoryController.createCategory);

router.route('/:categoryId')
  .get(categoryController.getCategory)
  .patch(auth(RoleEnum.ADMIN), validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(auth(RoleEnum.ADMIN), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = router;