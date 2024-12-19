const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { reviewValidation } = require('../../validations');
const { reviewController } = require('../../controllers');
const RoleEnum = require('../../common/enums/role.enum');

const router = express.Router();

router
  .route('/')
  .get(validate(reviewValidation.getReviews), reviewController.getReviews)
  .post(
    auth(RoleEnum.CUSTOMER),
    validate(reviewValidation.createReview),
    reviewController.createReview,
  );

router
  .route('/:reviewId')
  .patch(
    auth(RoleEnum.CUSTOMER),
    validate(reviewValidation.updateReview),
    reviewController.updateReview,
  )
  .delete(
    auth(RoleEnum.CUSTOMER),
    validate(reviewValidation.deleteReview),
    reviewController.deleteReview,
  );

module.exports = router;
