import mongoose, { Schema } from "mongoose";


const conversationSchema = new Schema(
  {
    members: [{
      type: Schema.Types.ObjectId,
      ref: "user"
    }]
  },
  { timestamps: true }
);

const Conversation = mongoose.model("conversation", conversationSchema);

export default Conversation

