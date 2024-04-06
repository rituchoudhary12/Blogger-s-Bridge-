import mongoose from "mongoose";

const { Schema } = mongoose;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: Schema.Types.Mixed, // Store arbitrary data
      ref: "Comment", // Reference to the Blog model
    },
  ],
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
