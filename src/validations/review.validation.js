const Joi = require('joi');
const { objectId } = require('./custom.validation');

const reviewQuery = Joi.object().keys({
  productId: Joi.string().custom(objectId).required(),
  sortBy: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
});

const reviewParam = Joi.object().keys({
  reviewId: Joi.string().custom(objectId),
});

const reviewForm = Joi.object().keys({
  productId: Joi.string().custom(objectId),
  rating: Joi.number().min(1).max(5),
  comment: Joi.string(),
});

const createReview = {
  body: reviewForm,
};

const getReviews = {
  query: reviewQuery,
};

const updateReview = {
  params: reviewParam,
  body: reviewForm,
};

const deleteReview = {
  params: reviewParam,
};

module.exports = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
};
