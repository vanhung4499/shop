const { Cart } = require('../models');

const redisCartItemsToCart = (cartItems) => {
  let cart = {
    items: [],
    total: 0,
  };

  for (let productId in cartItems) {
    let item = JSON.parse(cartItems[productId]);
    cart.items.push({
      productId,
      quantity: item.quantity,
      name: item.name,
      imageUrl: item.imageUrl,
      price: item.price,
    });
  }

  cart.total = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return cart;
};

module.exports = {
  redisCartItemsToCart,
};
