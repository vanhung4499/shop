const catchAsync = require('../utils/catch-async');
const result = require('../utils/result');
const RoleEnum = require('../common/enums/role.enum');
const pick = require('../utils/pick');
const { orderService } = require('../services');

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body);
  res.send(result.success(order));
});

const getOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.getOrderById(orderId);
  res.send(result.success(order));
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // Check current user role
  const currentUser = req.user;

  // If user is customer, get only his orders
  if (currentUser.role === RoleEnum.CUSTOMER) {
    filter.user = currentUser.id;
  }
  const orders = await orderService.getOrders(filter, options);
  res.send(result.success(orders));
});

const updateOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.updateOrderById(orderId, req.body);
  res.send(result.success(order));
});

const deleteOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  await orderService.deleteOrderById(orderId);
  res.send(result.success());
});

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
};
