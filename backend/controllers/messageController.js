import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId} = req.params;
    const { text, receiverId } = req.body;
    const senderId = req.user?.id;

    if (!senderId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

   // console.log('senderId and conversationId from server:', senderId , conversationId)
    
    if (!text) {
      res.json({ message: "message cannot be empty" });
    }

    const message = await Message.create({
      conversationId,
      sender: senderId,
      receiver: receiverId,
      text,
    });
    
    return res.status(200).json({ message: "Message sent", data: message });
  
  } catch (error) { 
    console.error("Error in sending message from server:", error);
    return res
      .status(500)
      .json(
        { message: "unable sent message error from server", error: true },
        { success: false }
      );
  }
};

export const getMessage = async(req,res)=>{
    try {
        const {conversationId} = req.params;
        const message = await Message.find({conversationId}).populate("sender","name profileImage")

        //console.log('messages from server:', message)
        if(!message){
            res.status(404).json({message: "No message yet", success: false});
        }

        return res.status(200).json({data: message})
    } catch (error) {
        console.error('Error in fetching messages');
        return res.status(500).json({ error: true, message: "unable to fetch error from server"},{ success: false});
    }
}