const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const CartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

// add plugin that converts mongoose to json
CartSchema.plugin(toJSON);

// Method to calculate total price
CartSchema.methods.calculateTotal = function () {
  this.total = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
};

// Middleware to calculate total price before saving
CartSchema.pre('save', function (next) {
  this.calculateTotal();
  next();
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
