import Blog from "../models/Blog.js";
import User from "../models/User.js";

export const getBlog = async (req, res) => {
  try {
    const { blog_id } = req.params;
    const blog = await Blog.findById(blog_id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res
      .status(200)
      .json({ blog, success: true, message: "Blog found successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const createBlog = async (req, res) => {
  try {
    const { title, content, user_id } = req.body;
    const newBlog = new Blog({ title, content, author: user_id });
    await newBlog.save();

    // Find the user who created the blog
    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Add the new blog's ID to the user's blogs array

    user.blogs.push(newBlog);
    await user.save();

    res
      .status(201)
      .json({ success: true, message: "Blog created successfully", data: {blog: newBlog} });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { blog_id } = req.body;
    const updates = req.body;
    const blog = await Blog.findByIdAndUpdate(blog_id, updates, { new: true });
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res
      .status(200)
      .json({ blog, success: true, message: "Blog updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { blog_id } = req.params;
    const blog = await Blog.findByIdAndDelete(blog_id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
