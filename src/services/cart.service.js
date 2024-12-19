const { Cart, Product } = require('../models');
const { BizError } = require('../common/errors');
const ResultCode = require('../common/enums/result-code');

const getCartByUserId = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
};

const addItemToCart = async (userId, item) => {
  const cart = await getCartByUserId(userId);

  // Check if product exists
  const product = await Product.findById(item.productId);
  if (!product) {
    throw new BizError(ResultCode.PRODUCT_NOT_FOUND);
  }

  // // Check if product is in stock
  // if (product.stock < item.quantity) {
  //   throw new BizError(ResultCode.PRODUCT_OUT_OF_STOCK);
  // }

  // Check if product already in cart
  const cartItem = cart.items.find(
    (i) => i.product.toString() === item.productId,
  );
  if (cartItem) {
    cartItem.quantity += item.quantity;
    // Check if quantity go to zero
    if (cartItem.quantity <= 0) {
      // Remove item from cart
      cart.items = cart.items.filter(
        (i) => i.product.toString() !== item.productId,
      );
    }
  } else {
    if (item.quantity <= 0) {
      throw new BizError(ResultCode.INVALID_QUANTITY);
    }
    cart.items.push({
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
      name: product.name,
    });
  }

  await cart.save();
  return cart;
};

const updateCartItem = async (userId, itemId, updateBody) => {
  const cart = await getCartByUserId(userId);
  let cartItem = cart.items.id(itemId);

  const product = await Product.findById(updateBody.productId);
  if (!product) {
    throw new BizError(ResultCode.PRODUCT_NOT_FOUND);
  }

  if (!cartItem) {
    // Create a new item if not found
    cart.items.push({
      productId: updateBody.productId,
      name: product.name,
      url: product.url,
      price: product.price,
      quantity: updateBody.quantity,
    });
  } else {
    cartItem.quantity = updateBody.quantity;
  }

  await cart.save();
  return cart;
};

const removeItemFromCart = async (userId, itemId) => {
  const cart = await getCartByUserId(userId);

  const cartItem = cart.items.id(itemId);
  if (!cartItem) {
    throw new BizError(ResultCode.CART_ITEM_NOT_FOUND);
  }

  cartItem.remove();

  await cart.save();
  return cart;
};

const deleteCart = async (userId) => {
  const cart = await getCartByUserId(userId);

  await cart.remove();
};

module.exports = {
  getCartByUserId,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  deleteCart,
};
