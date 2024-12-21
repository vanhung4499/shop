const amqp = require('amqplib');
const logger = require('./logger');
const config = require('./config');

let channel, connection;

const rabbitConnect = async () => {
  try {
    connection = await amqp.connect(config.rabbitmq.url);
    channel = await connection.createChannel();
    logger.info('Connected to RabbitMQ! 🚀');
  } catch (error) {
    logger.error('Error connecting to RabbitMQ: ' + error);
  }
};

const sendMessage = async (queue, message) => {
  try {
    if (!channel) {
      await rabbitConnect();
    }

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));

    logger.info(`Sending message to ${queue}: ${message}`);
  } catch (error) {
    logger.error('Error sending message to RabbitMQ: ' + error);
  }
};

const sendDelayedMessage = async (queue, message, delay) => {
  try {
    if (!channel) {
      await rabbitConnect();
    }

    const exchange = 'delayed.exchange';
    await channel.assertExchange(exchange, 'x-delayed-message', {
      arguments: {
        'x-delayed-type': 'direct',
      },
    });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, queue);

    const options = { persistent: true, headers: { 'x-delay': delay } };
    channel.publish(exchange, queue, Buffer.from(message), options);

    logger.info(`Sending delayed message to ${queue}: ${message}`);
  } catch (error) {
    logger.error('Error sending delayed message to RabbitMQ: ' + error);
  }
};

const consumeMessage = async (queue, handler) => {
  try {
    if (!channel) {
      await rabbitConnect();
    }

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (message) => {
      if (message !== null) {
        logger.info(
          `Message received from ${queue}: ${message.content.toString()}`,
        );
        try {
          await handler(message);
          channel.ack(message);
          logger.info(`Message acknowledged from ${queue}`);
        } catch (error) {
          logger.error(`Error handling message from ${queue}: ${error}`);
        }
      } else {
        logger.warn(`Received null message from ${queue}`);
      }
    });

    logger.info(`Consumer setup complete for queue: ${queue}`);
  } catch (error) {
    logger.error(`Error consuming messages from RabbitMQ: ${error}`);
  }
};

module.exports = {
  rabbitConnect,
  sendMessage,
  sendDelayedMessage,
  consumeMessage,
  channel,
  connection,
};
