import { createServer } from "http";
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { issueJWT } from "./lib/utils.js";

import SocketService from "./services/socket.js";

const PORT = process.env.PORT;

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const socketServer = new SocketService();

socketServer.io.attach(server);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "backend is working!" });
});

app.get("/login", (req, res) => {
  const { token, expires } = issueJWT({
    _id: "yrtewett1e8rg82ge7",
    name: "hritik",
  });

  res
    .cookie("jwt", token, {
      httpOnly: true,
    })
    .status(200)
    .redirect("http://localhost:5173/chat");
});

server.listen(PORT, () => {
  console.log(`server listening on PORT: ${PORT}`);
});

socketServer.initListeners();
