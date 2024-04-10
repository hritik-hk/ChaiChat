import express from "express";
import { PrismaClient } from "@prisma/client";
import { genPassword, issueJWT, validPassword } from "../lib/utils.js";

const prisma = new PrismaClient();

//register or login
const createUser = async (req: express.Request, res: express.Response) => {
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

const loginUser = async (req: express.Request, res: express.Response) => {
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
      const { token, expires } = issueJWT({ id: user.id, email: user.email }); //issue token

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

const checkAuth = async (req: express.Request, res: express.Response) => {
  let token = null;
  try {
    if (req.body.user && req.headers.cookie) {
      token = req.headers.cookie?.split("=")[1];
      res.status(200).json({ token });
    } else {
      res.status(401).json({ token });
    }
  } catch (err) {
    console.log("checkAuth",err);
  }
};

export { createUser, loginUser, checkAuth };
