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
    channel.assertQueue(queue, { durable: true });
    logger.info(`Sending message to ${queue}: ${message}`);
  } catch (error) {
    logger.error('Error sending message to RabbitMQ: ' + error);
  }
};

module.exports = { rabbitConnect, sendMessage, channel, connection };
