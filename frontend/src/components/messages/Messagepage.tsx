import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";

interface MessagePageProps {
  selectedChat: any;
  onBack: () => void;
}

interface JwtPayload {
  id?: string;
  [key: string]: any;
}

export default function MessagePage({ selectedChat, onBack }: MessagePageProps) {
  const { id: conversationId } = useParams(); // ✅ properly get :id from URL
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const token = useSelector((state: RootState) => state.auth.token);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<any>(null);

  // ✅ decode user
  const decodedUser = token ? jwtDecode<JwtPayload>(token) : null;
  const userId = decodedUser?.id;

  // ✅ get the other user from selectedChat
  const otherUser = selectedChat?.members?.find(
    (m: any) => m._id !== userId
  );

  // ✅ connect socket
  useEffect(() => {
    if (!userId) return;

    socketRef.current = io("http://localhost:5000"); // 🔁 your backend URL here
    socketRef.current.emit("join_conversation", conversationId);

    // receive messages
    socketRef.current.on("receive_message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [conversationId, userId]);

  // ✅ send message
  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      conversationId,
      sender: userId,
      text: input.trim(),
    };

    socketRef.current.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  // ✅ scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        <button
          onClick={onBack}
          className="md:hidden text-gray-700 dark:text-gray-300"
        >
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
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs ${
                msg.sender === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900"
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
