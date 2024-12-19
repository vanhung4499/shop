const { Order, Product } = require('../models');
const { BizError } = require('../common/errors');
const ResultCode = require('../common/enums/result-code');
const OrderStatusEnum = require('../common/enums/order-status.enum');

const createOrder = async (userId, orderBody) => {
  // Check if all products exist
  const productIds = orderBody.items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: orderBody.productIds } });
  if (products.length !== orderBody.productIds.length) {
    throw new BizError(ResultCode.PRODUCT_NOT_FOUND);
  }

  const order = Order.create({
    userId,
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

module.exports = {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderById,
  deleteOrderById,
};
