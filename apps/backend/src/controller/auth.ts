import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { genPassword, issueJWT, validPassword } from "../lib/utils.js";
import { IRequest } from "../interfaces/common.js";

const prisma = new PrismaClient();

//register or login
const createUser = async (req: IRequest, res: Response) => {
  try {
    const { hash, salt } = genPassword(req.body.password);

    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        username: req.body.username,
        password_salt: salt,
        password_hash: hash,
      },
    });
    res.status(201).json({ msg: "user created" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const loginUser = async (req: IRequest, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "invalid credentials" });
    }

    const isValid = validPassword(
      password,
      user.password_hash,
      user.password_salt
    );

    if (isValid) {
      const { token, expires } = issueJWT({
        id: user.id,
        username: user.username,
        email: user.email,
      }); //issue token

      const cookieOptions = {
        httpOnly: true,
        maxAge: expires,
      };

      // if (process.env.NODE_ENV == "production") {
      //   cookieOptions.secure = true;
      // }

      res
        .status(200)
        .cookie("jwt", token, cookieOptions)
        .json({ success: true, token: token });
    } else {
      res.status(401).json({ msg: "invalid credentials" });
    }
  } catch (err) {
    res.sendStatus(500).json({ error: err });
  }
};

const checkAuth = async (req: IRequest, res: Response) => {
  let token = null;
  try {
    if (req?.user && req.headers.cookie) {
      token = req.headers.cookie?.split("=")[1];
      res.status(200).json({ token });
    } else {
      res.status(401).json({ token });
    }
  } catch (err) {
    console.log("checkAuth", err);
  }
};

export { createUser, loginUser, checkAuth };
