const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ReviewSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true },
);

// add plugin that converts mongoose to json
ReviewSchema.plugin(toJSON);
ReviewSchema.plugin(paginate);

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
