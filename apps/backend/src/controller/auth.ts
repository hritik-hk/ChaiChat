import express from "express";
import { PrismaClient } from "@prisma/client";
import { genPassword, issueJWT, validPassword } from "../lib/utils.js";
import { error } from "console";

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
      const { token, expires } = issueJWT({ username }); //issue token

      res
        .status(200)
        .cookie("jwt", token, {
          maxAge: expires ,
          httpOnly: true,
        })
        .json({ token: token });
    } else {
      res.status(401).json({ msg: "invalid credentials" });
    }
  } catch (err) {
    res.sendStatus(500).json({ error: err });
  }
};

export { createUser, loginUser };
