import mongoose from "mongoose";

const { Schema } = mongoose;

const replySchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
});

const Reply = mongoose.model("Reply", replySchema);

export default Reply;
