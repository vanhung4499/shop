const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger');

mongoose.connection.once('open', () => {
  logger.info('MongoDB connection ready!🚀');
});

mongoose.connection.on('error', (err) => {
  logger.error('Database not connected🫡!!!' + err);
});

async function mongoConnect() {
  await mongoose.connect(config.mongoose.url, config.mongoose.options);
}

module.exports = { mongoConnect };
