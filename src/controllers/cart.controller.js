const { cartService } = require('../services');
const catchAsync = require('../utils/catch-async');
const result = require('../utils/result');

const getCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const cart = await cartService.getCartByUserId(userId);
  res.send(result.success(cart));
});

const addItemToCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const cart = await cartService.addItemToCart(userId, req.body);
  res.send(result.success(cart));
});

const updateCartItem = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;
  const cart = await cartService.updateCartItem(userId, itemId, req.body);
  res.send(result.success(cart));
});

const removeItemFromCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;
  const cart = await cartService.removeItemFromCart(userId, itemId);
  res.send(result.success(cart));
});

const deleteCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await cartService.deleteCart(userId);
  res.send(result.success());
});

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  deleteCart,
};
