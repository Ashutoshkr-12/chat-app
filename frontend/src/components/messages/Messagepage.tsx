import { useState, useEffect, useRef } from "react";
import type { RootState } from "@/redux/store";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { addMessage, fetchMessages, sendMessage as sendMessageThunk } from "@/redux/messageSlice";

interface MessagePageProps {
  selectedChat: any;
  onBack: () => void;
}

interface JwtPayload {
  id?: string;
  [key: string]: any;
}

export default function MessagePage({ selectedChat, onBack }: MessagePageProps) {
  const { conversationId } = useParams<{ conversationId: string }>();
  //console.log(conversationId)
  const [text, setText] = useState("");
  const token = useAppSelector((state: RootState) => state.auth.token);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const decodedUser = token ? jwtDecode<JwtPayload>(token) : null;
  const userId = decodedUser?.id;
  const messageState  = useAppSelector((state) => state.messages)

  //console.log('messages:',messageState)
  if(!conversationId) return;


  const currentMessages = conversationId ? messageState[conversationId] || [] : [];


  const otherUser = selectedChat?.members?.find((m: any) => m._id !== userId);

  // socket connection
    useEffect(() => {
      if (!conversationId || !userId || !token) return;
  
      socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
        auth: { token },
      });
  
      socketRef.current.emit("join_conversation", { conversationId });
  
      socketRef.current.on("message:receive", (msg: any) => {
       dispatch(addMessage(msg));
      });
  
      return () => {
        socketRef.current.disconnect();
      };
    }, [conversationId, userId, token]);

    useEffect(()=> {
        dispatch(fetchMessages(conversationId))
    },[conversationId])

  const sendMessage = () => {
    if (!text.trim() || !socketRef.current) return;


socketRef.current.on("message:receive", (msg: any) => {
  dispatch(addMessage(msg));
});

   
   
   // console.log('conversationId from messagePage:', conversationId);

    dispatch(
      sendMessageThunk({
        conversationId,
        text: text,
        receiverId: otherUser?._id,
      })
    );
    setText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageState]);

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }


  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white dark:bg-gray-800">
        <button onClick={onBack} className="md:hidden text-gray-700 dark:text-gray-300">
          ←
        </button>
        <img
          src={otherUser?.profilePic || "/default-avatar.png"}
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="text-sm font-medium">
            {otherUser?.name || "Unknown User"}
          </h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {currentMessages?.map((msg: any, idx: number) => (
          <div
            key={idx}
            className={`flex ${
              msg?.sender._id === userId ?   "justify-end" : "justify-start" 
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs ${
                msg.sender._id === userId
                  ? "bg-gray-500 text-white"
                  : "bg-green-500  text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center border-t p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 outline-none border rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
