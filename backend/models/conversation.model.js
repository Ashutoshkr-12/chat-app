import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    text: {
        type: String,
        default: ''
    },
    imageUrl: {
          type: String,
        default: ''
    },
    videoUrl: {
          type: String,
        default: ''
    },
    seen: {
          type: Boolean,
        default: false
    },
  },
  { timestamps: true }
);

const conversationSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: user,
    },
    message: {
      type: Schema.Types.ObjectId,
      ref: "message",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("message", MessageSchema);
const Conversation = mongoose.model("conversation", conversationSchema);

export default { Message, Conversation };

//id , sender, receiver, message, timestamp
//message - id text imageUrl videoUrl seen time
