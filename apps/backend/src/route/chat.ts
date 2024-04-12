import express from "express";
import { getOrCreatePrivateChat } from "../controller/chat.js";

const router = express.Router();

router.get("/new/:recipientId", getOrCreatePrivateChat);

export default router;
