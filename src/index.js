const app = require('./app');
const config = require('./config/config');
const { mongoConnect } = require('./config/mongo');
const logger = require('./config/logger');

// Import jobs
const jobs = require('./jobs');

async function startServer() {
  // Connect to MongoDB
  await mongoConnect();

  app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port} 🚀`);
  });
}

startServer();
