const Joi = require('joi');
const { objectId } = require('./custom.validation');

const itemParam = Joi.object().keys({
  itemId: Joi.string().custom(objectId).required(),
});

const cartItemForm = Joi.object().keys({
  productId: Joi.string().custom(objectId).required(),
  quantity: Joi.number().required(),
});

const addCartItem = {
  body: cartItemForm,
};

const updateCartItem = {
  params: itemParam,
  body: cartItemForm,
};

const removeCartItem = {
  params: itemParam,
};

module.exports = {
  addCartItem,
  updateCartItem,
  removeCartItem,
};
