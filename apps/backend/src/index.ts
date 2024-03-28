import http from "http";
import "dotenv/config";

import SocketService from "./services/socket.js";

const PORT = process.env.PORT;

const server = http.createServer();

const socketServer = new SocketService();

socketServer.io.attach(server);

server.listen(PORT, () => {
  console.log(`server listening on PORT: ${PORT}`);
});

socketServer.initListeners();
