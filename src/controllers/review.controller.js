const { reviewService } = require('../services');
const catchAsync = require('../utils/catch-async');
const result = require('../utils/result');
const pick = require('../utils/pick');

const getReviews = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['productId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const reviews = await reviewService.getReviews(filter, options);
  res.send(result.success(reviews));
});

const createReview = catchAsync(async (req, res) => {
  // Get the user ID from passport
  const userId = req.user.id;
  // Add the user ID to the review form
  const reviewForm = req.body;
  reviewForm.userId = userId;
  // Create the review
  const review = await reviewService.createReview(reviewForm);
  res.send(result.success(review));
});

const updateReview = catchAsync(async (req, res) => {
  const requesterId = req.user.id;
  const { reviewId } = req.params;
  req.body.requesterId = requesterId;
  const review = await reviewService.updateReviewById(reviewId, req.body);
  res.send(result.success(review));
});

const deleteReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const requesterId = req.user.id;
  await reviewService.deleteReviewById(reviewId, requesterId);
  res.send(result.success());
});

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};
