import express from "express";
import { fetchUserInfo } from "../controller/user.js";
const router = express.Router();

router.get("/own", fetchUserInfo);

export default router;
