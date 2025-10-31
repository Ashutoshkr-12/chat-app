import { useEffect } from "react";
import ChatList from "./ChatList";
import MessagePage from "@/components/messages/Messagepage";
import { cn } from "@/lib/utils";
import { fetchConversations } from "@/redux/conversationSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getSocket } from "@/socket/socket";
import { addIncomingRequest } from "@/redux/requestSlice";
import { addMessage } from "@/redux/messageSlice";
import { Routes, Route } from "react-router-dom";

export default function ChatInterface() {
  const dispatch = useAppDispatch();
  const { list, status } = useAppSelector((state) => state.conversations);
  const loading = status === "loading";

  // Fetch conversations once
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // Socket listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("request:received", (data) => {
      dispatch(addIncomingRequest(data.from));
    });

    socket.on("request:accepted", (data) => {
      dispatch(fetchConversations());
      console.log("Accepted request:", data);
    });

    socket.on("conversation:new", (conv) => {
      console.log("New Conversation:", conv);
    });

    socket.on("message:receive", (msg) => {
      console.log("New message:", msg);
      dispatch(addMessage(msg));
    });

    socket.on("user:online", (userId) => {
      console.log("User online:", userId);
    });

    socket.on("user:offline", (userId) => {
      console.log("User offline:", userId);
    });

    return () => {
      socket.off("request:received");
      socket.off("request:accepted");
      socket.off("message:receive");
      socket.off("user:online");
      socket.off("user:offline");
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={cn(
          "w-full md:w-1/3 lg:w-1/4 border-r bg-white dark:bg-gray-800 transition-all duration-300"
        )}
      >
        <ChatList chats={list || []} loading={loading} onSelectChat={() => {}} />
      </div>

      {/* Chat Page (right side) */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-white dark:bg-gray-900 transition-all duration-300"
        )}
      >
        <Routes>
          <Route
            path="/"
            element={
              <p className="text-lg font-medium flex items-center justify-center h-full text-gray-500">
                Select a chat to start messaging
              </p>
            }
          />
          <Route path=":conversationId" element={<MessagePage />} />
        </Routes>
      </div>
    </div>
  );
}
