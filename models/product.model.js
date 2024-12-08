const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 }, // percentage
        stock: { type: Number, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        brand: { type: String },
        images: [String],
        tags: [String],
        ratings: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                rating: { type: Number, required: true },
                comment: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
