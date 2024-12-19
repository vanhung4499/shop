const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addressParam = Joi.object().keys({
  addressId: Joi.string().custom(objectId),
});

const addressForm = Joi.object().keys({
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().optional(),
  country: Joi.string().required(),
});

const createAddress = {
  body: addressForm,
};

const updateAddress = {
  params: addressParam,
  body: addressForm,
};

const deleteAddress = {
  params: addressParam,
};

module.exports = {
  createAddress,
  deleteAddress,
  updateAddress,
};
