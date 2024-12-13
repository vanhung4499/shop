const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
