const redis = require('redis');
const config = require('./config');
const logger = require('./logger');

const redisClient = redis.createClient({ url: config.redis.url });

redisClient.on('connect', () => {
  logger.info('Redis connected! 🚀');
});

redisClient.on('error', (err) => {
  logger.error('Redis error: ' + err);
});

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
