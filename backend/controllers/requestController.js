import MessageRequest from "../models/request.model.js";
import Conversation from "../models/conversation.model.js";

export const sendRequest = async (req, res) => {
  try {
    
    const senderId = req.userId;
    const { receiverId } = req.body;

    const alreadyFriends = MessageRequest.find({ from: senderId, to: receiverId });

    if (alreadyFriends)
      return res.status(404).json(
        {
          error: true,
          message: "Request already sent",
        },
        { success: false }
      );

    const newReq = MessageRequest.create({ from: senderId, to: receiverId });

    return res
      .status(200)
      .json({ message: "Request Sent", data: newReq }, { success: true });

  } catch (error) {
    console.error("Error in sending request from server:", error);
    return res
      .status(500)
      .json(
        { error: true, message: "Error in sending request from server" },
        { success: true }
      );
  }
};

export const getRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId)
      return res
        .status(404)
        .json({ error: true, message: "unable to find the user" });

    const requests = await MessageRequest.find({
      to: userId,
      status: "PENDING",
    }).populate("from", "name email profileImage");

    return res
      .status(200)
      .json({ message: "Request fetched", data: requests }, { status: true });
  } catch (error) {
    console.error("Error in fetching user request:", error);
    return res
      .status(500)
      .json(
        { error: true, message: "Unable to fetch requests from server" },
        { success: true }
      );
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await MessageRequest.findById(requestId);

    if (!request)
      return res
        .status(404)
        .json(
          { error: true, message: "Request not found" },
          { success: false }
        );

    request.status = "ACCEPTED";
    await request.save();

    //concversation

    const conversation = await Conversation.create({
      members: [request.from, request.to],
    });

    return res
      .status(200)
      .json(
        { message: "Request accepted", data: conversation },
        { success: true }
      );
  } catch (error) {
    console.error("Error in accepting req from server:", error);
    return (
      res.status(500),
      json(
        { error: true, message: "Unable to accept request error from server" },
        { success: false }
      )
    );
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await MessageRequest.findById(requestId);

    if (!request)
      return res
        .status(404)
        .json(
          { error: true, message: "Request not found" },
          { success: false }
        );

    request.status = "REJECTED";
    await request.save();

    return res
      .status(200)
      .json({ message: "Request rejected" }, { success: true });
  } catch (error) {
    console.error("error in rejection:", error);
    return res
      .status(500)
      .json(
        { error: true, message: "Unable to reject request from the server" },
        { success: false }
      );
  }
};
