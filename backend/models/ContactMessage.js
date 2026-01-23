import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    subject: {
      type: String,
      required: true,
      enum: ["general", "support", "feedback", "partnership", "bug"]
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread"
    },
    adminReply: {
      type: String,
      default: ""
    },
    repliedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("ContactMessage", contactMessageSchema);