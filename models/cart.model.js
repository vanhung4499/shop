const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
