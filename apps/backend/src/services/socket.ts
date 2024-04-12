import { Server } from "socket.io";
import { Redis } from "ioredis";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { PrismaClient } from "@prisma/client";
import { ISocket } from "../interfaces/common.js";

const prisma = new PrismaClient();

interface payload {
  userId: string;
}

// const redis_connection = {
//   host: process.env.REDIS_HOST_URL,
//   port: parseInt(process.env.REDIS_PORT as string),
//   username: process.env.REDIS_USERNAME,
//   password: process.env.REDIS_PASSWORD,
// };

// const pub = new Redis(redis_connection);

// const sub = new Redis(redis_connection);

export default class SocketService {
  private _io: Server;

  constructor() {
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: process.env.FRONTEND_URL,
        credentials: true,
      },
    });
    // sub.subscribe("MESSAGES");
    console.log("socket server initialized");
  }

  private mountJoinPrivateChatEvent(socket: ISocket) {
    socket.on("private-chat", (chatId) => {
      // console.log(
      //   `${socket?.user?.username} is on one to one chat with`,
      //   username
      // );
      console.log(`${socket?.user?.username} has joined roomId: ${chatId}`)
      socket.join(chatId);
    });
  }

  public initListeners() {
    const io = this._io;

    io.use(async (socket: ISocket, next) => {
      try {
        // parse the cookies from the handshake headers (This is only possible if client has `withCredentials: true`)
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        let token = cookies?.jwt; // get the jwt token

        if (!token) {
          // Token is required for the socket to work
          throw new Error("Un-authorized handshake. Token is missing");
        }

        const jwt_secret = process.env.JWT_SECRET as string;

        const decodedToken = jwt.verify(token, jwt_secret) as payload; // decode the token

        const user = await prisma.user.findUnique({
          where: { id: decodedToken.userId },
          select: {
            id: true,
            username: true,
            email: true,
          },
        });

        // retrieve the user
        if (!user) {
          throw new Error("Un-authorized handshake. Token is invalid");
        }

        socket.user = user; // mount te user object to the socket

        next();
      } catch (error: any) {
        socket.emit(
          "socketError",
          error?.message ||
            "Something went wrong while connecting to the socket"
        );
        next(new Error("Something went wrong while connecting to the socket"));
      }
    });

    io.on("connect", (socket: ISocket) => {
      const userId = socket.user?.id.toString() as string;

      socket.join(userId);
      console.log("new user connected userId: ", userId);

      //initialize one-to-one private chat
      this.mountJoinPrivateChatEvent(socket);

      socket.on("socketError", (msg) => {
        console.log(msg);
      });

      socket.on("message", async (msg: string) => {
        console.log("message received: " + msg);

        //publish msg to remote redis server
        //await pub.publish("MESSAGES", JSON.stringify({ msg }));
      });

      //one to one private chat message listener
      socket.on("private-message", (roomId, msg) => {
        console.log(`event:private-message, roomId: ${roomId}, msg: `, msg);
        io.sockets.in(roomId).emit("private-message", msg);
      });

      socket.on("disconnect", () => {
        console.log("user disconnected: ", userId);
        if (userId) {
          socket.leave(userId);
        }
      });
    });

    // sub.on("message", (channel, message) => {
    //   if (channel === "MESSAGES") {
    //     io.emit("message", message);
    //   }
    // });
  }

  get io(): Server {
    return this._io;
  }
}
