const { Address } = require('../models');
const { BizError } = require('../common/errors');
const ResultCode = require('../common/constants/result-code');

const getAddressById = async (addressId) => {
  const address = await Address.findById(addressId);

  if (!address) {
    throw new BizError(ResultCode.ADDRESS_NOT_FOUND);
  }

  return address;
};

const getAddressesByUser = async (userId) => {
  return Address.find({ userId });
};

const createAddress = async (addressForm) => {
  return Address.create(addressForm);
};

const updateAddress = async (addressId, addressForm) => {
  const address = await getAddressById(addressId);

  if (address.user.toString() !== addressForm.requesterId) {
    throw new BizError(ResultCode.ADDRESS_NOT_BELONG_TO_USER);
  }

  Object.assign(address, addressForm);
  return address.save();
};

const deleteAddress = async (addressId, requesterId) => {
  const address = await getAddressById(addressId);

  if (address.userId.toString() !== requesterId) {
    throw new BizError(ResultCode.ADDRESS_NOT_BELONG_TO_USER);
  }

  return address.deleteOne();
};

module.exports = {
  getAddressesByUser,
  createAddress,
  deleteAddress,
  updateAddress,
  getAddressById,
};
