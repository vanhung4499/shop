const { TransactionTypeEnum } = require('../common/enums');
const { BizError } = require('../common/errors');
const { ResultCode } = require('../common/constants');
const request = require('../utils/request');
const logger = require('../config/logger');

const createTransaction = async (order) => {
  try {
    // Create a payment for the order
    await request({
      url: '/api/payment',
      method: 'post',
      data: {
        type: TransactionTypeEnum.PAYMENT,
        orderId: order.id,
        amount: order.total,
        userId: order.userId,
      },
    });

    return true;
  } catch (error) {
    logger.error('Create transaction failed: ' + error);
    return false;
  }
};

const createAccount = async (user) => {
  try {
    // Create a shop pay account for payment
    const accountId = await request({
      url: 'api/accounts',
      method: 'post',
      data: {
        email: user.email,
        userId: user.id,
      },
    });

    return accountId;
  } catch (error) {
    throw new BizError(ResultCode.CREATE_ACCOUNT_FAILED);
  }
};

module.exports = {
  createAccount,
  createTransaction,
};
