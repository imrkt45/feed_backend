// src/server.js

require("dotenv").config();

const http = require("http");

const app = require("./app");

const connectDB = require("./config/db");

const {
  connectRedis,
} = require("./config/redis");

const {
  initWebSocket,
} = require("./websocket/websocket");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // DB CONNECTION
    await connectDB();

    // REDIS CONNECTION
    await connectRedis();

    // CREATE HTTP SERVER
    const server = http.createServer(app);

    // INITIALIZE WEBSOCKET
    initWebSocket(server);

    server.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();