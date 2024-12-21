const { Review } = require('../models');
const { BizError } = require('../common/errors');
const ResultCode = require('../common/constants/result-code');

const getReviews = async (filter, options) => {
  return Review.paginate(filter, options);
};

const getReviewById = async (reviewId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new BizError(ResultCode.REVIEW_NOT_FOUND);
  }

  return review;
};

const createReview = async (reviewForm) => {
  return Review.create(reviewForm);
};

const updateReviewById = async (reviewId, reviewForm) => {
  const review = await getReviewById(reviewId);

  if (review.userId.toString() !== reviewForm.requesterId) {
    throw new BizError(ResultCode.REVIEW_NOT_BELONG_TO_USER);
  }

  Object.assign(review, reviewForm);
  await review.save();
  return review;
};

const deleteReviewById = async (reviewId, requesterId) => {
  const review = await getReviewById(reviewId);

  if (review.userId.toString() !== requesterId) {
    throw new BizError(ResultCode.REVIEW_NOT_BELONG_TO_USER);
  }

  return review.deleteOne();
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReviewById,
  deleteReviewById,
};
