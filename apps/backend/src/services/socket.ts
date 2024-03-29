import { Server } from "socket.io";

export default class SocketService {
  private _io: Server;

  constructor() {
    this._io = new Server();
    console.log("socket server initialized");
  }

  public initListeners() {
    const io = this._io;
    io.on("connect", (socket) => {
      console.log("new user connected", socket.id);
      socket.on("message", (msg: string) => {
        console.log("message: " + msg);
      });
    });
  }

  get io(): Server {
    return this._io;
  }
}
