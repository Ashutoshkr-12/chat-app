import { io } from "socket.io-client"
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

export const initSocket = (token: string) => {
    socket = io(`${import.meta.env.VITE_BACKEND_URL}`,{
        auth: { token },
        transports: ["websocket"],
    });

    socket.on("connect", () => {} //console.log("socketId:", socket?.id)
    )
    socket.on("disconnect", ()=> {} //console.log("Socket disconnected")
    );

    return socket;
}

export const getSocket = () => socket;