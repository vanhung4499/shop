const { Cart, Product } = require('../models');
const { BizError } = require('../common/errors');
const ResultCode = require('../common/enums/result-code');
const RedisKeyConstants = require('../common/constants/redis-key.constant');
const redisClient = require('../config/redis');
const { cartConverter } = require('../converters');
const logger = require('../config/logger');

const getCartKey = (userId) =>
  `${RedisKeyConstants.CUSTOMER_CART_PREFIX}${userId}`;

// Use this function to cache cart to Redis
const cacheCart = async (cart) => {
  try {
    const cartKey = getCartKey(cart.userId.toString());

    for (const item of cart.items) {
      const cartItem = {
        productId: item.productId.toString(),
        quantity: item.quantity,
        name: item.name,
        image: item.image,
        price: item.price,
      };
      logger.info(cartItem);
      await redisClient.hSet(
        cartKey,
        cartItem.productId,
        JSON.stringify(cartItem),
      );
    }
  } catch (err) {
    logger.info('Cache cart to Redis failed: ' + err);
  }
};

const getCart = async (userId) => {
  // Get cart from Redis first
  const cartKey = getCartKey(userId);
  const cartItems = await redisClient.hGetAll(cartKey);

  // If cart is empty, get cart from MongoDB
  if (!cartItems) {
    const cart = await Cart.findOne({ userId });

    if (cart) {
      return cart;
    }
    // Otherwise, return empty cart
    return { items: [], total: 0 };
  }

  return cartConverter.redisCartItemsToCart(cartItems);
};

const addCartItem = async (userId, item) => {
  // Check if product exists
  const product = await Product.findById(item.productId);
  if (!product) {
    throw new BizError(ResultCode.PRODUCT_NOT_FOUND);
  }

  // Check if product stock is enough
  if (product.stock < item.quantity) {
    throw new BizError(ResultCode.PRODUCT_STOCK_INSUFFICIENT);
  }

  // Get cart from Redis
  const cartKey = getCartKey(userId);
  const cartItem = await redisClient.hGet(cartKey, item.productId);
  // If item already exists, update the quantity
  if (cartItem) {
    const updatedItem = JSON.parse(cartItem);
    updatedItem.quantity += item.quantity;

    // If quantity is 0, remove the item
    if (updatedItem.quantity <= 0) {
      await redisClient.hDel(cartKey, item.productId);
    } else {
      // Update the item in Redis
      await redisClient.hSet(
        cartKey,
        item.productId,
        JSON.stringify(updatedItem),
      );
    }
  } else {
    // If not exists, add new item

    // Make sure quantity is positive
    if (item.quantity <= 0) {
      throw new BizError(ResultCode.INVALID_QUANTITY);
    }

    const newCartItem = {
      productId: item.productId,
      quantity: item.quantity,
      name: product.name,
      url: product.url,
      price: product.price,
    };
    await redisClient.hSet(
      cartKey,
      item.productId,
      JSON.stringify(newCartItem),
    );
  }
};

const updateCartItem = async (userId, itemId, item) => {
  // Check if quantity is positive
  if (item.quantity <= 0) {
    throw new BizError(ResultCode.INVALID_QUANTITY);
  }

  // Check if product exists
  const product = await Product.findById(item.productId);
  if (!product) {
    throw new BizError(ResultCode.PRODUCT_NOT_FOUND);
  }

  // Check if product stock is enough
  if (product.stock < item.quantity) {
    throw new BizError(ResultCode.PRODUCT_STOCK_INSUFFICIENT);
  }

  // Get item from Redis
  const cartKey = getCartKey(userId);
  let cartItem = await redisClient.hGet(cartKey, item.productId);

  // If item not found, add new item
  if (!cartItem) {
    cartItem = {
      productId: item.productId,
      quantity: item.quantity,
      name: product.name,
      url: product.url,
      price: product.price,
    };
  } else {
    cartItem = JSON.parse(cartItem);
    // Update the quantity
    cartItem.quantity = item.quantity;
  }

  // Update the item in Redis
  await redisClient.hSet(cartKey, item.productId, JSON.stringify(cartItem));
};

const removeCartItem = async (userId, itemId) => {
  const cartKey = getCartKey(userId);
  const cartItem = await redisClient.hGet(cartKey, itemId);

  if (!cartItem) {
    throw new BizError(ResultCode.CART_ITEM_NOT_FOUND);
  }

  await redisClient.hDel(cartKey, itemId);
};

const deleteCart = async (userId) => {
  // Delete cart from Redis
  const cartKey = getCartKey(userId);
  await redisClient.del(cartKey);

  // Delete cart from MongoDB
  await Cart.findByIdAndDelete(userId);
};

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  deleteCart,
};
