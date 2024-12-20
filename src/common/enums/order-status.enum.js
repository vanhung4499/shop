const OrderStatusEnum = Object.freeze({
  PENDING: 'Pending',
  WAITING_PAYMENT: 'Waiting Payment',
  PAID: 'Paid',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  PAYMENT_FAILED: 'Payment Failed',
});

module.exports = OrderStatusEnum;
