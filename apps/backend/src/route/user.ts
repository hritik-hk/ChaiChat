import express from "express";
import { fetchLoggedInUser, fetchUserByUsername } from "../controller/user.js";
const router = express.Router();

router.get("/own", fetchLoggedInUser).get("/:username", fetchUserByUsername);

export default router;
