const { cartService } = require('../services');
const catchAsync = require('../utils/catch-async');
const result = require('../utils/result');

const getCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const cart = await cartService.getCart(userId);
  res.send(result.success(cart));
});

const addCartItem = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const cart = await cartService.addCartItem(userId, req.body);
  res.send(result.success(cart));
});

const updateCartItem = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;
  const cart = await cartService.updateCartItem(userId, itemId, req.body);
  res.send(result.success(cart));
});

const removeCartItem = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;
  const cart = await cartService.removeCartItem(userId, itemId);
  res.send(result.success(cart));
});

const deleteCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await cartService.deleteCart(userId);
  res.send(result.success());
});

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  deleteCart,
};
