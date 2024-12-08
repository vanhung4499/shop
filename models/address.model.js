const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
