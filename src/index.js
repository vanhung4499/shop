const app = require('./app');
const config = require('./config/config');
const {mongoConnect} = require("./config/mongo");

async function startServer() {
  await mongoConnect()

  app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`);
  });
}

startServer();