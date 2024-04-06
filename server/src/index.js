import dotenv from "dotenv";
import express from "express";
import { mongoConnect } from "./config/mongoConnect.js";
import userRouter from "./routes/userRouter.js";
import blogRouter from "./routes/blogRouter.js";
import commentRouter from "./routes/commentRouter.js";
import replyRouter from "./routes/replyRouter.js";

const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 3004;

mongoConnect();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/comments", commentRouter);
app.use("/api/replies", replyRouter);
