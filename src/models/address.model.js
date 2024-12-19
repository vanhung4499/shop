const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const AddressSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { timestamps: true },
);

// add plugin that converts mongoose to json
AddressSchema.plugin(toJSON);

const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;
