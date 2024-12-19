// Description: Define result code for API response.
// Result code format: x - yy - zz
// x: type of code
//    1 - Business code (Business logic, Validation, ...)
//    2 - Infrastructure code (Database, Server, File, External Service, ...)
//    0 - Common HTTP status code
// yy: Module code (2 digits) eg. 01 for User module
// zz: Code number (2 digits) eg. 01, 02, 03, ...
const ResultCode = Object.freeze({
  // --- Common HTTP status code ---
  SUCCESS: { code: 200, message: 'Success' },
  BAD_REQUEST: { code: 400, message: 'Bad Request' },
  UNAUTHORIZED: { code: 401, message: 'Unauthorized' },
  FORBIDDEN: { code: 403, message: 'Forbidden' },
  NOT_FOUND: { code: 404, message: 'Not Found' },
  INTERNAL_SERVER_ERROR: { code: 500, message: 'Internal Server Error' },
  VALIDATION_ERROR: { code: 422, message: 'Validation Error' },

  // --- Business code ---

  // User
  USER_NOT_FOUND: { code: 1010, message: 'User not found' },
  USER_EMAIL_EXISTS: { code: 10100, message: 'Email already exists' },
  USER_USERNAME_EXISTS: { code: 10102, message: 'Username already exists' },

  // Category
  CATEGORY_NOT_FOUND: { code: 10200, message: 'Category not found' },
  CATEGORY_EXISTS: { code: 10201, message: 'Category already exists' },

  // Product
  PRODUCT_NOT_FOUND: { code: 10300, message: 'Product not found' },
  PRODUCT_EXISTS: { code: 10301, message: 'Product already exists' },
  PRODUCT_OUT_OF_STOCK: { code: 10302, message: 'Product out of stock' },

  // Order
  ORDER_NOT_FOUND: { code: 10400, message: 'Order not found' },

  // Cart
  CART_NOT_FOUND: { code: 10500, message: 'Cart not found' },
  INVALID_QUANTITY: { code: 10501, message: 'Invalid quantity' },
  CART_ITEM_NOT_FOUND: { code: 10502, message: 'Cart item not found' },

  // Review
  REVIEW_NOT_FOUND: { code: 10600, message: 'Review not found' },
  REVIEW_NOT_BELONG_TO_USER: {
    code: 10601,
    message: 'Review does not belong to user',
  },

  // Banner
  BANNER_NOT_FOUND: { code: 10700, message: 'Banner not found' },

  // Address
  ADDRESS_NOT_FOUND: { code: 10800, message: 'Address not found' },
  ADDRESS_NOT_BELONG_TO_USER: {
    code: 10801,
    message: 'Address does not belong to user',
  },

  // --- Infrastructure code ---
  DB_ERROR: { code: 30001, message: 'Database error' },
  SERVER_ERROR: { code: 30101, message: 'Server error' },
  FILE_UPLOAD_ERROR: { code: 30201, message: 'File upload error' },
});

module.exports = ResultCode;
