const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const CategorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  { timestamps: true },
);
// add plugin that converts mongoose to json
CategorySchema.plugin(toJSON);

module.exports = mongoose.model('Category', CategorySchema);
