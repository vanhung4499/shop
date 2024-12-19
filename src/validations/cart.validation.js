const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addItemToCart = {
  body: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
    quantity: Joi.number().min(1).required(),
  }),
};

const updateCartItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    quantity: Joi.number().min(1).required(),
  }),
};

const removeItemFromCart = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
};
