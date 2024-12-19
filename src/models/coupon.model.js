const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const CouponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    minimumPurchase: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
// add plugin that converts mongoose to json
CouponSchema.plugin(toJSON);
CouponSchema.plugin(paginate);

const Coupon = mongoose.model('Coupon', CouponSchema);

module.exports = Coupon;
