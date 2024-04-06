import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: Number,
    required: false,
    unique: false,
  },
  blogs: [
    {
      type: Schema.Types.Mixed, // Store arbitrary data
      ref: "Blog", // Reference to the Blog model
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
