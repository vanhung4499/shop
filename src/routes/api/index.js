const express = require("express");
const authRoute = require("./auth.route");
const categoryRoute = require("./category.route");
const userRoute = require("./user.route");

const router = express.Router();

// Authentication
router.use('/auth', authRoute);

// Users
router.use('/users', userRoute);

// Products
// router.route('/products', productRoute)

// Categories
router.use('/categories', categoryRoute);

// Orders

// Coupons





module.exports = router;
