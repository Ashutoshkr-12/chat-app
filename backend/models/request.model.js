import mongoose, { Schema } from "mongoose";

const messageRequestSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const MessageRequest = mongoose.model("request", messageRequestSchema);

export default MessageRequest;
