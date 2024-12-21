const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { addressValidation } = require('../../validations');
const { addressController } = require('../../controllers');
const RoleEnum = require('../../common/enums/role.enum');

const router = express.Router();

router
  .route('/')
  .get(auth(RoleEnum.CUSTOMER), addressController.getCurrentUserAddresses)
  .post(
    auth(RoleEnum.CUSTOMER),
    validate(addressValidation.createAddress),
    addressController.createAddress,
  );

router
  .route('/:addressId')
  .get(
    auth(RoleEnum.CUSTOMER),
    validate(addressValidation.getAddress),
    addressController.getAddress,
  )
  .patch(
    auth(RoleEnum.CUSTOMER),
    validate(addressValidation.updateAddress),
    addressController.updateAddress,
  )
  .delete(
    auth(RoleEnum.CUSTOMER),
    validate(addressValidation.deleteAddress),
    addressController.deleteAddress,
  );

module.exports = router;
