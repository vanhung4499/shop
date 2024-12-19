const { Review } = require('../models');
const { BizError } = require('../common/errors');
const ResultCode = require('../common/enums/result-code');

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

const updateReviewById = async (reviewId, userId, reviewForm) => {
  const review = await getReviewById(reviewId);

  if (review.userId.toString() !== userId) {
    throw new BizError(ResultCode.REVIEW_NOT_BELONG_TO_USER);
  }

  Object.assign(review, reviewForm);
  await review.save();
  return review;
};

const deleteReviewById = async (reviewId, userId) => {
  const review = await getReviewById(reviewId);

  if (review.userId.toString() !== userId) {
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
