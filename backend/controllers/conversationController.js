import Conversation from "../models/conversation.model.js";

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({ members: userId })
      .populate("members", "name email profileImage online")
      .sort({ updatedAt: -1 });

    return res
      .status(200)
      .json(
        { message: "Conversation fetched", data: conversations },
        { success: true }
      );
  } catch (error) {
    console.error("Error in finding conversation from server:", error);
    return res
      .status(500)
      .json(
        { error: true, message: "unable to fetch converstaion" },
        { success: false }
      );
  }
};
