import { Server } from "socket.io";
import { Redis } from "ioredis";

const redis_connection = {
  host: process.env.REDIS_HOST_URL,
  port: parseInt(process.env.REDIS_PORT as string),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
};

const pub = new Redis(redis_connection);

const sub = new Redis(redis_connection);

export default class SocketService {
  private _io: Server;

  constructor() {
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
    console.log("socket server initialized");
  }

  public initListeners() {
    const io = this._io;

    // io.use((socket, next) => {

    // });

    io.on("connect", (socket) => {
      console.log("new user connected", socket.id);
      socket.on("message", async (msg: string) => {
        console.log("message received: " + msg);

        //publish msg to remote redis server
        await pub.publish("MESSAGES", JSON.stringify({ msg }));
      });

      socket.on("disconnect", () => {
        console.log(`user disconnected- ${socket.id}`);
      });
    });

    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }

  get io(): Server {
    return this._io;
  }
}
