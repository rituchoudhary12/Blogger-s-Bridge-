import express from "express";
import {
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,

} from "../controllers/blogControllers.js";
import { auth } from "../middlewares/authMiddleware.js";
const blogRouter = express.Router();

blogRouter.get("/:blog_id", auth, getBlog);
blogRouter.post("/create",auth,  createBlog);
blogRouter.put("/update", auth, updateBlog);
blogRouter.delete("/delete/:blog_id", auth, deleteBlog);

export default blogRouter;
