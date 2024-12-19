const express = require('express');
const authRoute = require('./auth.route');
const categoryRoute = require('./category.route');
const userRoute = require('./user.route');
const productRoute = require('./product.route');
const bannerRoute = require('./banner.route');
const addressRoute = require('./address.route');
const reviewRoute = require('./review.route');

const router = express.Router();

// Authentication
router.use('/auth', authRoute);

// Users
router.use('/users', userRoute);

// Products
router.use('/products', productRoute);

// Categories
router.use('/categories', categoryRoute);

// Orders

// Coupons

// Payments

// Banner
router.use('/banners', bannerRoute);

// Address
router.use('/addresses', addressRoute);

// Reviews
router.use('/reviews', reviewRoute);

module.exports = router;
