const axios = require('axios');
const config = require('../config/config');
const { ResultCode } = require('../common/constants');
const logger = require('../config/logger');

// Create a new axios instance for requests to the shop API
const request = axios.create({
  baseURL: config.shopPay.url,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'x-api-key': config.shopPay.apiKey,
  },
});

// Add a response interceptor
request.interceptors.response.use(
  (response) => {
    // Extract code and data from response
    const { code, data, msg } = response.data;

    // Check if the response is successful
    if (code === ResultCode.SUCCESS.code) {
      // Return the data
      return data;
    }

    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

module.exports = request;
