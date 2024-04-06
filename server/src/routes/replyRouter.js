import express from "express";
import {
  getReply,
  createReply,
  updateReply,
  deleteReply,
} from "../controllers/replyControllers.js";
import { auth } from "../middlewares/authMiddleware.js";
const replyRouter = express.Router();

replyRouter.get("/:comment_id", auth, getReply);
replyRouter.post("/create", auth, createReply);
replyRouter.put("/update", auth, updateReply);
replyRouter.delete("/delete/:reply_id", auth, deleteReply);

export default replyRouter;
