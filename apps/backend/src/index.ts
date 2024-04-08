import { createServer } from "http";
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import SocketService from "./services/socket.js";
import userRouter from "./route/auth.js";

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

app.use("/api/user", userRouter);

server.listen(PORT, () => {
  console.log(`server listening on PORT: ${PORT}`);
});

socketServer.initListeners();
