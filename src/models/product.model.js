const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ProductSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    stock: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: String },
    images: { type: [String] },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  { timestamps: true },
);

// add plugin that converts mongoose to json
ProductSchema.plugin(toJSON);
ProductSchema.plugin(paginate);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
