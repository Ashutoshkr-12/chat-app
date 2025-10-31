import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";


export default function MessagePage() {
  const { conversationId } = useParams();
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.messages[conversationId ?? ""])

  const [input, setInput] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);


  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      conversationId: selectedChat._id,
      sender: user?._id,
      text: input,
    };

    socketRef.current.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          src={
            selectedChat.sender._id === user?._id
              ? selectedChat.receiver.profilePic
              : selectedChat.sender.profilePic
          }
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="text-sm font-medium">
            {selectedChat.sender._id === user?._id
              ? selectedChat.receiver.name
              : selectedChat.sender.name}
          </h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === user?._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs ${
                msg.sender === user?._id
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
