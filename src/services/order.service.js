const { Order, Product } = require('../models');
const { BizError } = require('../common/errors');
const ResultCode = require('../common/enums/result-code');
const OrderStatusEnum = require('../common/enums/order-status.enum');

const createOrder = async (orderBody) => {
  const order = Order.create({
    user: orderBody.user,
    items: orderBody.items,
    total: orderBody.total,
    status: OrderStatusEnum.PENDING,
  });

  await order.save();
  return order;
};

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new BizError(ResultCode.ORDER_NOT_FOUND);
  }
  return order;
};

const getOrders = async (filter, options) => {
  const orders = await Order.paginate(filter, options);
  return orders;
};

const updateOrderById = async (orderId, updateBody) => {
  const order = await getOrderById(orderId);
  Object.assign(order, updateBody);
  await order.save();
  return order;
};

const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);
  await order.deleteOne();
  return order;
};

const changeOrderStatus = async (orderId, status) => {
  const order = await getOrderById(orderId);
  order.status = status;
  await order.save();
  return order;
};

module.exports = {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderById,
  deleteOrderById,
  changeOrderStatus,
};
