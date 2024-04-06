import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOTPEmail } from "../utils/nodeMailer.js";


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign({ user_id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });
    res
      .status(200)
      .json({ token, success: true, message: "Logged in successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(1000 + Math.random() * 9000);
    const newUser = new User({ username, password: hashedPassword, email , otp });
    await newUser.save();
// paattt 
    // Send OTP email to the user
    await sendOTPEmail(email, otp);


    res
      .status(201)
      .json({ success: true, message: "User created successfully & OTP sent to email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const verifyUser = async (req, res) => {
  try {
    const { username, otp } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      if (otp === existingUser.otp) {
        return res
          .status(200)
          .json({
            success: true,
            message: "User verified successfully now you can login",
          });
      }
      return res
        .status(400)
        .json({ success: false, message: "Wrong Otp try again" });
    }
    else {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Credentials Please try again" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


export const updateUser = async (req, res) => {
  try {
    const { password, user_id } = req.body;
    console.log(user_id)

        // Verify OTP before updating user
        const existingUser = await User.findOne({ _id: user_id });
        if (!existingUser) {
          return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    

 // Update password if OTP is valid

    const updates = {password};
    const user = await User.findOneAndUpdate({ _id: user_id }, updates, {
      new: true,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ user, success: true, message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOneAndDelete({ username });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    const user = await User.findById({_id: user_id});
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ user, success: true, message: "User found successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};