const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const BannerSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    linkUrl: {
      type: String,
      required: false,
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
BannerSchema.plugin(toJSON);

const Banner = mongoose.model('Banner', BannerSchema);

module.exports = Banner;
