const mongoose = require("mongoose");
const PaymentStatusEnum = require("../common/enums/payment-status.enum");

const PaymentSchema = new mongoose.Schema(
    {
        orderId: {type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true},
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        amount: {type: Number, required: true},
        paymentMethod: {type: String, required: true},
        status: {type: String, enum: Object.values(PaymentStatusEnum), default: PaymentStatusEnum.PENDING},
    },
    {timestamps: true}
);

module.exports = mongoose.model("Payment", PaymentSchema);