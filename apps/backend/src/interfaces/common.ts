import { Socket } from "socket.io";
import { Request } from "express";

export interface IUser {
  id: string;
  username: string | null;
  email: string;
}

export interface ISocket extends Socket {
  user?: IUser;
}

export interface IRequest extends Request {
  user?: IUser;
}
