const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ProductSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    // Stock of the product
    stock: { type: Number, required: true },
    // Locked stock, when an order is placed, stock is locked until the order is paid
    lockedStock: { type: Number, default: 0 },
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
