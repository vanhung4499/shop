const { addressService } = require('../services');
const result = require('../utils/result');
const catchAsync = require('../utils/catch-async');

const createAddress = catchAsync(async (req, res) => {
  // Get current user id from passport
  const userId = req.user.id;
  // Update addressForm with user id
  const addressForm = req.body;
  addressForm.userId = userId;
  // Create address
  const address = await addressService.createAddress(addressForm);
  res.send(result.success(address));
});

const getCurrentUserAddresses = catchAsync(async (req, res) => {
  // Get current user id from passport
  const userId = req.user.id;
  // Get addresses by user id
  const addresses = await addressService.getAddressesByUser(userId);
  res.send(result.success(addresses));
});

const updateAddress = catchAsync(async (req, res) => {
  // Get current user id from passport
  const userId = req.user.id;
  const { addressId } = req.params;
  const address = await addressService.updateAddress(
    addressId,
    userId,
    req.body,
  );
  res.send(result.success(address));
});

const deleteAddress = catchAsync(async (req, res) => {
  // Get current user id from passport
  const userId = req.user.id;
  const { addressId } = req.params;
  await addressService.deleteAddress(addressId, userId);
  res.send(result.success());
});

module.exports = {
  createAddress,
  getCurrentUserAddresses,
  deleteAddress,
  updateAddress,
};
