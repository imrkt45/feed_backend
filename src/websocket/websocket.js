// src/websocket/websocket.js

const WebSocket = require("ws");

let wss;

const initWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Client Connected");

    ws.on("close", () => {
      console.log("Client Disconnected");
    });
  });
};

const broadcastFeed = (feed) => {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "NEW_FEED",
          data: feed,
        })
      );
    }
  });
};

module.exports = {
  initWebSocket,
  broadcastFeed,
};