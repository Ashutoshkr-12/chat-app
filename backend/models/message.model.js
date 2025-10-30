import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    conversationId:{
        type: Schema.Types.ObjectId,
        ref: "conversation"
    },
    sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }, 
  text: {
    type: String,
    default: ""
  },
  imageUrl: {
    type: String,
    default: ""
  },
  seen: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Message = mongoose.model('message',messageSchema);

export default Message;