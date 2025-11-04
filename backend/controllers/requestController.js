import MessageRequest from "../models/request.model.js";
import Conversation from "../models/conversation.model.js";


export const sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    //console.log('senderId:', senderId);

    if ( senderId === receiverId) return res.status(400).json({message: "Cannot send request to yourself"});

    const alreadyRequest = await MessageRequest.findOne({ $or: [
      {from: senderId, to: receiverId},
      { to: senderId, from: receiverId}
    ] });

    if (alreadyRequest) {
       return res.status(400).json({
        error: true,
        message: "Request already sent",
        success: false
      });
    }

    const newReq = await MessageRequest.create({ from: senderId, to: receiverId });

    return res.status(200).json({ message: "Request Sent", data: newReq, success: true });

  } catch (error) {
    console.error("Error in sending request from server:", error);
    return res.status(500).json({ error: true, message: "Error in sending request from server", success: false });
  }
};

export const getRequest = async (req, res) => {
  try {
    const userId  = req.user.id;

    if (!userId)
      return res
        .status(404)
        .json({ error: true, message: "unable to find the user", success: false });

    const requests = await MessageRequest.find({
      to: userId,
      status: "PENDING",
    }).populate("from", "name email profileImage");

    return res.status(200).json({ message: "Request fetched", data: requests, success: true });
  } catch (error) {
    console.error("Error in fetching user request:", error);
    return res.status(500).json({ error: true, message: "Unable to fetch requests from server", success: false });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await MessageRequest.findById(requestId);

    if (!request)
      return res
        .status(404)
        .json({ error: true, message: "Request not found", success: false });

    request.status = "ACCEPTED";
    await request.save();

    //conversation
    const conversation = await Conversation.create({
      members: [request.from, request.to],
    });

    return res.status(200).json({ message: "Request accepted", data: conversation, success: true });
  } catch (error) {
    console.error("Error in accepting req from server:", error);
    return res.status(500).json({ error: true, message: "Unable to accept request error from server", success: false });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await MessageRequest.findById(requestId);

    if (!request)
      return res
        .status(404)
        .json({ error: true, message: "Request not found", success: false });

    request.status = "REJECTED";
    await request.save();

    return res.status(200).json({ message: "Request rejected", success: true });
  } catch (error) {
    console.error("error in rejection:", error);
    return res.status(500).json({ error: true, message: "Unable to reject request from the server", success: false });
  }
};
