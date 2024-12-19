const catchAsync = require('../utils/catch-async');

const getLoginPage = catchAsync(async (req, res) => {
  res.render('shop/auth/login');
});

const getRegisterPage = catchAsync(async (req, res) => {
  res.render('shop/auth/register');
});

const getLogout = catchAsync(async (req, res) => {
  res.redirect('/login');
});

const getHomePage = catchAsync(async (req, res) => {
  // const products = await productService.queryProducts();
  res.render('shop/home');
});

const getProductsPage = catchAsync(async (req, res) => {
  // const products = await productService.queryProducts();
  res.render('shop/product-detail');
});

module.exports = {
  getLoginPage,
  getRegisterPage,
  getHomePage,
  getLogout,
  getProductsPage,
};
