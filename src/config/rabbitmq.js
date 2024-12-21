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

const sendMessage = async (queue, message, ttl = null) => {
  try {
    if (!channel) {
      await rabbitConnect();
    }

    const options = { persist: true };

    if (ttl) {
      options.expiration = ttl;
    }

    channel.assertQueue(queue, { durable: true });
    logger.info(`Sending message to ${queue}: ${message}`);
  } catch (error) {
    logger.error('Error sending message to RabbitMQ: ' + error);
  }
};

const consumeMessage = async (queue, handler) => {
  try {
    if (!channel) {
      await rabbitConnect();
    }

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, handler, { noAck: true });

    logger.info(`Consuming message from ${queue}`);
  } catch (error) {
    logger.error('Error consuming message from RabbitMQ: ' + error);
  }
};

module.exports = {
  rabbitConnect,
  sendMessage,
  consumeMessage,
  channel,
  connection,
};
