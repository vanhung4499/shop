const logger = require('../config/logger');
const { rabbitConnect } = require('../config/rabbitmq');

// Import all consumers
require('./order-close.handler');

const startConsumers = async () => {
  try {
    // Connect to RabbitMQ
    await rabbitConnect();

    logger.info('All consumers are set up and running.');
  } catch (error) {
    logger.error(`Error starting consumers: ${error}`);
  }
};

startConsumers();
