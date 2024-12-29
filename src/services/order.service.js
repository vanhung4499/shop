const { Order } = require('../models');
const { BizError } = require('../common/errors');
const { ResultCode } = require('../common/constants');
const productService = require('./product.service');
const userService = require('./user.service');
const { sendDelayedMessage } = require('../config/rabbitmq');
const {
  RabbitMQConstants,
  OrderCancelReasonConstants,
} = require('../common/constants');
const config = require('../config/config');
const logger = require('../config/logger');
const paymentService = require('./payment.service');
const { OrderStatusEnum, PaymentStatusEnum } = require('../common/enums');

// Create a new order, use transaction to ensure data consistency
const createOrder = async (orderForm) => {
  // Start transaction
  const session = await Order.startSession();
  session.startTransaction();

  try {
    // Lock stock for all products in the order
    const lockStockResult = await productService.lockStock(orderForm.items);

    if (!lockStockResult) {
      throw new BizError(ResultCode.PRODUCT_STOCK_INSUFFICIENT);
    }

    // Save order to database
    const order = await saveOrder(orderForm);

    // Commit transaction
    await session.commitTransaction();
    await session.endSession();

    return order;
  } catch (error) {
    // Rollback transaction if error occurs
    await session.abortTransaction();
    await session.endSession();
    logger.info('Create order failed: ' + error);
    throw error;
  }
};

// Save order to database
const saveOrder = async (orderForm) => {
  const order = await Order.create({
    userId: orderForm.userId,
    items: orderForm.items,
    total: orderForm.total,
    status: OrderStatusEnum.PENDING,
    paymentMethod: orderForm.paymentMethod,
    shippingAddress: orderForm.shippingAddress,
  });

  await order.save();

  // Each order will have a waiting time for payment
  // After that time, the order will be closed if not paid

  // Send message to MQ with TTL for handling payment expiration
  const message = JSON.stringify({ orderId: order.id });
  const timeout = config.business.orderTimeout;
  await sendDelayedMessage(
    RabbitMQConstants.ORDER_CLOSE_QUEUE,
    message,
    timeout,
  );

  return order;
};

const payOrder = async (orderId) => {
  const order = await getOrderById(orderId);

  // If order is not pending, it cannot be paid
  if (order.status !== OrderStatusEnum.PENDING) {
    throw new BizError(ResultCode.ORDER_CANNOT_PAY);
  }

  // TODO: Call the payment gateway api here to process payment
  // For demo purpose, we assume payment is successful
  const paymentResult = await paymentService.createTransaction(order);

  // If payment is successful
  if (paymentResult) {
    // Update order status to paid
    await changeOrderStatus(orderId, OrderStatusEnum.PAID);
    // Deduct stock of products in the order
    await productService.deductStock(order.items);
  } else {
    // If create payment failed

    // Unlock stock for all products in the order
    await productService.unlockStock(order.items);

    // Update order status to failed
    await changeOrderStatus(orderId, OrderStatusEnum.FAILED);

    throw new BizError(ResultCode.ORDER_PAYMENT_FAILED);
  }
};

const paymentResult = async (result) => {
  // Handle payment result from payment service
  const { transactionId, status, orderId } = result;

  // Update transaction status
  const order = await getOrderById(orderId);

  // If payment is successful
  if (status === PaymentStatusEnum.SUCCESS) {
    // Update order status to paid
    order.status = OrderStatusEnum.PAID;
    await order.save();

    // Deduct stock of products in the order
    await productService.deductStock(order.items);
  } else {
    // If payment failed

    // Unlock stock for all products in the order
    await productService.unlockStock(order.items);

    // Update order status to failed
    order.status = OrderStatusEnum.FAILED;

    // Update transaction id for tracking
    order.transactionId = transactionId;

    await order.save();

    throw new BizError(ResultCode.ORDER_PAYMENT_FAILED);
  }
};

const cancelOrder = async (cancelForm) => {
  const order = await getOrderById(cancelForm.orderId);

  // // Check order belongs to user
  // if (order.userId !== cancelForm.requesterId) {
  //   throw new BizError(ResultCode.ORDER_NOT_BELONG_TO_USER);
  // }

  // If order is not pending or paid, it cannot be cancelled
  if (
    order.status !== OrderStatusEnum.PENDING &&
    order.status !== OrderStatusEnum.PAID
  ) {
    throw new BizError(ResultCode.ORDER_CANNOT_CANCEL);
  }

  // Unlock stock for all products in the order
  await productService.unlockStock(order.items);

  // Update cancel reason to order
  if (cancelForm.reason) {
    order.cancelReason = cancelForm.reason;
  }

  // Update order status to cancelled
  order.status = OrderStatusEnum.CANCELLED;

  // Save order
  await order.save();
};

// Try to close order when payment is expired
const closeOrder = async (orderId) => {
  const order = await getOrderById(orderId);

  // Only close order if it is still pending
  if (order.status !== OrderStatusEnum.PENDING) {
    return false;
  }

  // Update order status to CANCELLED and set cancel reason
  order.status = OrderStatusEnum.CANCELLED;
  order.cancelReason = OrderCancelReasonConstants.PAYMENT_TIMEOUT;
  await order.save();

  // Unlock stock for all products in the order
  await productService.unlockStock(order.items);

  return true;
};

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new BizError(ResultCode.ORDER_NOT_FOUND);
  }

  return order;
};

const getOrders = async (filter, options) => {
  return Order.paginate(filter, options);
};

const updateOrderById = async (orderId, updateForm) => {
  const order = await getOrderById(orderId);
  Object.assign(order, updateForm);
  await order.save();
  return order;
};

const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);
  await order.deleteOne();
  return order;
};

const changeOrderStatus = async (orderId, status) => {
  const order = await getOrderById(orderId);
  order.status = status;
  await order.save();
};

module.exports = {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderById,
  deleteOrderById,
  changeOrderStatus,
  closeOrder,
  cancelOrder,
  payOrder,
  paymentResult,
};
