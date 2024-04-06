import express from "express";
import {
  getUser,
  loginUser,
  updateUser,
  deleteUser,
  createUser,
  verifyUser,
} from "../controllers/userControllers.js";
import {auth} from "../middlewares/authMiddleware.js"
const userRouter = express.Router();

userRouter.get("/:username", auth, getUser);
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.put("/update", auth, updateUser);
userRouter.delete("/delete/:username", auth, deleteUser);
userRouter.post("/verify", verifyUser)
export default userRouter;
