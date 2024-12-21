const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { PaymentMethodEnum, OrderStatusEnum } = require('../common/enums');

const orderParam = Joi.object().keys({
  orderId: Joi.string().custom(objectId),
});

const orderItem = Joi.object().keys({
  productId: Joi.string().custom(objectId),
  quantity: Joi.number().integer().min(1),
  name: Joi.string(),
  price: Joi.number().min(0),
});

const orderForm = Joi.object().keys({
  userId: Joi.string().custom(objectId),
  items: Joi.array().items(orderItem).min(1),
  total: Joi.number().min(0),
  shippingAddress: Joi.string().custom(objectId),
  status: Joi.string().valid(...Object.values(OrderStatusEnum)),
  paymentMethod: Joi.string().valid(...Object.values(PaymentMethodEnum)),
});

const cancelForm = Joi.object().keys({
  orderId: Joi.string().custom(objectId),
  reason: Joi.string(),
});

const getOrders = {
  query: Joi.object().keys({
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createOrder = {
  body: orderForm,
};

const payOrder = {
  params: orderParam,
};

const cancelOrder = {
  body: cancelForm,
};

const getOrder = {
  params: orderParam,
};

const updateOrder = {
  params: orderParam,
  body: Joi.object().keys({
    status: Joi.string().valid(...Object.values(OrderStatusEnum)),
  }),
};

const deleteOrder = {
  params: orderParam,
};

module.exports = {
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  getOrders,
  payOrder,
  cancelOrder,
};
