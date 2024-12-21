const catchAsync = require('../utils/catch-async');
const result = require('../utils/result');
const RoleEnum = require('../common/enums/role.enum');
const pick = require('../utils/pick');
const { orderService } = require('../services');

const createOrder = catchAsync(async (req, res) => {
  // Assign current user id to order
  req.body.userId = req.user.id;
  const orderId = await orderService.createOrder(req.body);
  res.send(result.success(orderId));
});

const cancelOrder = catchAsync(async (req, res) => {
  req.body.requesterId = req.user.id;
  await orderService.cancelOrder(req.body);
  res.send(result.success());
});

const getOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;
  const order = await orderService.getOrderById(orderId, userId);
  res.send(result.success(order));
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // Check current user role
  const currentUser = req.user;

  // If user is customer, get only his orders
  if (currentUser.role === RoleEnum.CUSTOMER) {
    filter.userId = currentUser.id;
  }

  const orders = await orderService.getOrders(filter, options);
  res.send(result.success(orders));
});

const payOrder = catchAsync(async (req, res) => {
  const { orderId } = req.body;
  await orderService.payOrder(orderId);
  res.send(result.success());
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
  payOrder,
  cancelOrder,
};
