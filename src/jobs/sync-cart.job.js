const cron = require('node-cron');
const redisClient = require('../config/redis');
const { Cart } = require('../models');
const { cartConverter } = require('../converters');
const RedisConstants = require('../common/constants/redis-key.constant');
const logger = require('../config/logger');

const syncCartToMongo = async () => {
  logger.info('Start syncing cart to MongoDB');

  try {
    // Get all cart keys from Redis
    const cartsKey = RedisConstants.CUSTOMER_CART_PREFIX + '*';
    const cartKeys = await redisClient.keys(cartsKey);

    // Sync each cart to MongoDB
    for (const cartKey of cartKeys) {
      // Get userId from cart key
      const userId = cartKey.replace(RedisConstants.CUSTOMER_CART_PREFIX, '');

      // Get cart from Redis
      const cartItems = await redisClient.hGetAll(cartKey);

      // Convert Redis cart items to Cart object
      const cart = cartConverter.redisCartItemsToCart(cartItems);

      // Save cart to MongoDB
      await Cart.updateOne({ userId }, { items: cart.items }, { upsert: true });
    }

    logger.info('Sync cart to MongoDB successfully ✅');
  } catch (err) {
    logger.error('Sync cart to MongoDB failed: ' + err);
  }
};

// // Schedule to run at 02:00 AM every day
cron.schedule('0 2 * * *', async () => {
  logger.info('Sync cart job started');
  await syncCartToMongo();
});
