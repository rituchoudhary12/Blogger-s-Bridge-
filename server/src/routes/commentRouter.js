import express from "express";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentControllers.js";
import { auth } from "../middlewares/authMiddleware.js";
const commentRouter = express.Router();

commentRouter.get("/:blog_id", auth, getComments);
commentRouter.post("/create", auth, createComment);
commentRouter.put("/update", auth, updateComment);
commentRouter.delete("/delete/:comment_id", auth, deleteComment);

export default commentRouter;
