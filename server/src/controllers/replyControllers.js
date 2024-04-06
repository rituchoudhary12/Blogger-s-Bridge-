import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import Reply from "../models/Reply.js";
import User from "../models/User.js";

export const getReply = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const replies = await Reply.find({ comment: comment_id });
    res
      .status(200)
      .json({ replies, success: true, message: "Replies found successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createReply = async (req, res) => {
  try {
    const { content, comment_id, user_id, blog_id } = req.body;

    // Create the new reply
    const newReply = new Reply({
      content,
      author: user_id,
      comment: comment_id,
    });
    await newReply.save();

    // Find the comment associated with the reply
    const comment = await Comment.findById(comment_id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    // Push the new reply to the comment's replies array
    comment.replies.push(newReply);
    await comment.save();

    // Find the blog associated with the comment
    const blog = await Blog.findById(comment.blog);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // Find the index of the current comment in the blog's comments array
    const commentIndex = blog.comments.findIndex((comment) =>
      comment._id.equals(comment_id)
    );
    if (commentIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found in blog" });
    }

    // Remove the current comment from the blog's comments array
    blog.comments.splice(commentIndex, 1);

    // Add the updated comment to the blog's comments array
    blog.comments.push(comment);

    // Save the updated blog
    const updatedBlog = await blog.save();

    // Find the user who created the blog
    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the index of the current blog in the user's blogs array
    const blogIndex = user.blogs.findIndex((blog) => blog._id.equals(blog_id));
    if (blogIndex === -1) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Blog not found in user's blogs array",
        });
    }

    // Remove the current blog from the user's blogs array
    user.blogs.splice(blogIndex, 1);

    // Add the updated blog to the user's blogs array
    user.blogs.push(updatedBlog);

    // Save the updated user
    await user.save();

    res
      .status(201)
      .json({ success: true, message: "Reply created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateReply = async (req, res) => {
  try {
    const { reply_id } = req.params;
    const updates = req.body;
    const reply = await Reply.findByIdAndUpdate(reply_id, updates, {
      new: true,
    });
    if (!reply) {
      return res
        .status(404)
        .json({ success: false, message: "Reply not found" });
    }
    res
      .status(200)
      .json({ reply, success: true, message: "Reply updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const { reply_id } = req.params;
    const reply = await Reply.findByIdAndDelete(reply_id);
    if (!reply) {
      return res
        .status(404)
        .json({ success: false, message: "Reply not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Reply deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
