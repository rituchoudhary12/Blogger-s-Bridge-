import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const getComments = async (req, res) => {
  try {
    const { blog_id } = req.params;
    const comments = await Comment.find({ blog: blog_id });
    res
      .status(200)
      .json({
        comments,
        success: true,
        message: "Comments found successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createComment = async (req, res) => {
  try {
    const { content, blog_id, user_id } = req.body;
    const newComment = new Comment({
      content,
      author: user_id,
      blog: blog_id,
    });
    await newComment.save();

    // Find the blog associated with the comment
    const blog = await Blog.findById(blog_id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // Push the new comment to the blog's comments array
    blog.comments.push(newComment);
    const newBlog = await blog.save();

    // Find the user who created the blog
    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the index of the old blog in the user's blogs array
    const oldBlogIndex = user.blogs.findIndex((blog) =>
      blog._id.equals(blog_id)
    );

    if (oldBlogIndex === -1) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Old blog not found in user's blogs array",
        });
    }

    // Replace the old blog with the new blog in the user's blogs array
    user.blogs[oldBlogIndex] = newBlog;

    // Save the updated user document
    await user.save();

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: { comment: newComment },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const updateComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const updates = req.body;
    const comment = await Comment.findByIdAndUpdate(comment_id, updates, {
      new: true,
    });
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    res
      .status(200)
      .json({
        comment,
        success: true,
        message: "Comment updated successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const comment = await Comment.findByIdAndDelete(comment_id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
