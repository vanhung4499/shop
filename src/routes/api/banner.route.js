const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { bannerValidation } = require('../../validations');
const { bannerController } = require('../../controllers');
const RoleEnum = require('../../common/enums/role.enum');

const router = express.Router();

router
  .route('/')
  .get(validate(bannerValidation.getBanners), bannerController.getBanners)
  .post(
    auth(RoleEnum.ADMIN),
    validate(bannerValidation.createBanner),
    bannerController.createBanner,
  );

router
  .route('/:bannerId')
  .get(validate(bannerValidation.getBanner), bannerController.getBanner)
  .patch(
    auth(RoleEnum.ADMIN),
    validate(bannerValidation.updateBanner),
    bannerController.updateBanner,
  )
  .delete(
    auth(RoleEnum.ADMIN),
    validate(bannerValidation.deleteBanner),
    bannerController.deleteBanner,
  );

module.exports = router;
