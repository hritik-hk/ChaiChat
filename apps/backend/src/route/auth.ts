import express from "express";
import { createUser, loginUser, checkAuth } from "../controller/auth.js";
import isAuth from "../middleware/auth.js";

const router = express.Router();

router
  .post("/signup", createUser)
  .post("/login", loginUser)
  .get("/check", isAuth, checkAuth);

export default router;
