import { addIncomingRequest } from "@/redux/requestSlice";
import { getSocket } from "./socket";
import toast from "react-hot-toast";
import type { AppDispatch } from "@/redux/store";
import { addMessage } from "@/redux/messageSlice";


export const emitSendRequest = ( to: string, from: string) => {
    const socket = getSocket();
    if(!socket) return console.error('socket is not initialized')
    socket.emit("request-send", { to, from});
};


export const receiveRequest = (dispatch: AppDispatch) => {
    const socket = getSocket();
    if(!socket) return console.error('socket is not initialized')
   
          // Prevent duplicate listeners
  socket.off("request-receive");
  socket.off("request-accept");

   
   
        socket.on("request-receive", (data) => {
        //console.log('new request received:',data)
        dispatch(addIncomingRequest(data));
    });

    socket.on("request-accept", (data) => {
        toast.success(`${data.from?.name || "someone"} accepted your request`);
    });
};

export const joinConversation = (conversationId: string) => {
    const socket = getSocket();
    if(!socket) return console.error('socket not initialized');
    socket.emit("join-conversation", { conversationId });
};

export const emitSendMessage = (
    conversationId: string,
    senderId: string,
    receiverId: string,
    text: string,
) => {
   const socket = getSocket();
    if(!socket) return console.error('socket not initialized');
    socket.emit('message-send', { conversationId, senderId,receiverId, text});

};

export const messageListner = ( dispatch: AppDispatch) => {
    const socket = getSocket();
    if(!socket) return console.error('socket not initialized');


    socket.on("message-receive", (message) => {
    dispatch(addMessage({
      conversationId: message.conversationId,
      sender: message.sender,
      receiver: message.receiver,
      text: message.text,
    }));
    });
};