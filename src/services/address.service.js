const { Address } = require('../models');
const { BizError } = require('../common/errors');
const ResultCode = require('../common/enums/result-code');

const getAddressById = async (addressId) => {
  const address = await Address.findById(addressId).sort({ createdAt: -1 });

  if (!address) {
    throw new BizError(ResultCode.ADDRESS_NOT_FOUND);
  }

  return address;
};

const getAddressesByUser = async (userId) => {
  const addresses = await Address.find({ userId });
  return addresses;
};

const createAddress = async (addressForm) => {
  return Address.create(addressForm);
};

const updateAddress = async (addressId, userId, addressForm) => {
  const address = await getAddressById(addressId);

  if (address.user.toString() !== userId) {
    throw new BizError(ResultCode.ADDRESS_NOT_BELONG_TO_USER);
  }

  Object.assign(address, addressForm);
  return address.save();
};

const deleteAddress = async (addressId, userId) => {
  const address = await getAddressById(addressId);

  if (address.userId.toString() !== userId) {
    throw new BizError(ResultCode.ADDRESS_NOT_BELONG_TO_USER);
  }

  return address.remove();
};

module.exports = {
  getAddressesByUser,
  createAddress,
  deleteAddress,
  updateAddress,
};
