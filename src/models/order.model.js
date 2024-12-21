const mongoose = require('mongoose');
const OrderStatusEnum = require('../common/enums/order-status.enum');
const { toJSON, paginate } = require('./plugins');
const PaymentMethodEnum = require('../common/enums/payment-method.enum');

const OrderSchema = mongoose.Schema(
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
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatusEnum),
      default: OrderStatusEnum.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethodEnum),
      required: true,
    },
    transactionId: { type: String },
    cancelReason: { type: String },
  },
  { timestamps: true },
);

// add plugin that converts mongoose to json
OrderSchema.plugin(toJSON);
OrderSchema.plugin(paginate);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
