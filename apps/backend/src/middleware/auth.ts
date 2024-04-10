import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface payload {
  userId: string;
}

export default async function isAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    let token = null;
    if (req.headers.cookie !== undefined) {
      token = req.headers.cookie?.split("=")[1] as string;
      const jwt_secret = process.env.JWT_SECRET as string;
      const userPayload = jwt.verify(token, jwt_secret) as payload;

      const user = await prisma.user.findUnique({
        where: { id: userPayload.userId },
      });

      if (!user) {
        return res.status(401);
      }
      req.body.user = user;
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    console.log("Authentication error", err);
    next(err);
  }

  next();
}
