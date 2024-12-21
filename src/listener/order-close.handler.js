const orderService = require('../services/order.service');
const logger = require('../config/logger');
const { consumeMessage } = require('../config/rabbitmq');
const RabbitMQConstants = require('../common/constants/rabbitmq.constant');

const handleOrderClose = async (message) => {
  try {
    const { orderId } = JSON.parse(message.content.toString());
    const closeResult = await orderService.closeOrder(orderId);

    if (closeResult) {
      logger.info(`Order ${orderId} closed due to payment expired`);
    } else {
      console.log(`Order ${orderId} is not pending, no need to close`);
    }
  } catch (error) {
    logger.error(`Error handling order close: ${error}`);
  }
};

consumeMessage(RabbitMQConstants.ORDER_CLOSE_QUEUE, handleOrderClose);
