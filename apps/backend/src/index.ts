import { createServer } from "http";
import express from "express";
import cors from "cors";
import "dotenv/config";
import SocketService from "./services/socket.js";
import isAuth from "./middleware/auth.js";
import authRouter from "./route/auth.js";
import userRouter from "./route/user.js";

const PORT = process.env.PORT;

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

const socketServer = new SocketService();

socketServer.io.attach(server);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "backend is working!" });
});

app.get("/protected", isAuth, (req, res) => {
  console.log(req.body);
  res.status(200).json({ msg: "this is a protected route!" });
});

app.use("/api/auth", authRouter);
app.use("/api/user", isAuth, userRouter);

server.listen(PORT, () => {
  console.log(`server listening on PORT: ${PORT}`);
});

socketServer.initListeners();
