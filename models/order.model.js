const mongoose = require('mongoose');
const OrderStatusEnum = require("../common/enums/order-status.enum");

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
            },
        ],
        totalPrice: { type: Number, required: true },
        shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
        status: {
            type: String,
            enum: Object.values(OrderStatusEnum),
            default: OrderStatusEnum.PENDING,
        },
        paymentMethod: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
