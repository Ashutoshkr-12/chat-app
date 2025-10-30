import { io } from "socket.io-client"
import { addIncomingRequest } from "@/redux/requestSlice"
import { addConversation } from "@/redux/conversationSlice"
import { addMessage } from "@/redux/messageSlice"
import type { Socket } from "socket.io-client";
import type { Dispatch } from "redux";

// export interface IncomingRequest {
//     id: string;
//     fromUserId: string;
//     toUserId: string;
//     message?: string;
//     createdAt?: string;
//     [key: string]: any;
// }

// export interface Conversation {
//     id: string;
//     participants: string[];
//     lastMessage?: Message;
//     createdAt?: string;
//     [key: string]: any;
// }

// export interface Message {
//     id: string;
//     conversationId: string;
//     senderId: string;
//     text: string;
//     createdAt?: string;
//     [key: string]: any;
// }

export interface AppStore {
    dispatch: Dispatch;
    getState?: () => any;
    [key: string]: any;
}

export type AppSocket = Socket | null;

let socket: AppSocket = null;

export const initSocket = (store, userId) => {
    socket = io(import.meta.env.VITE_BACKEND_URL,{
        withCredentials: true,
    });

    socket.emit("user-online", userId);

    socket.on("receive-request",(data) => {
        store.dispatch(addIncomingRequest(data));
    });

    socket.on("request-accepted", (conversation) => {
        store.dispatch(addConversation(conversation));
    });

    socket.on("receive-message",(msg) => {
        store.dispatch(addMessage(msg));
    })

    return socket;
}

export const getSocket = () => socket;