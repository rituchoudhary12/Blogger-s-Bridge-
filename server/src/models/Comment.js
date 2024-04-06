import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  blog: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
  },
  replies: [
    {
      type: Schema.Types.Mixed, // Store arbitrary data
      ref: "Reply", // Reference to the Blog model
    },
  ],
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
