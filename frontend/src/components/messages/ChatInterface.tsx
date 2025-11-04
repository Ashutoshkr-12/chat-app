import { useState, useEffect } from "react";
import ChatList from "./ChatList";
import MessagePage from "@/components/messages/Messagepage";
import { cn } from "@/lib/utils";
import { fetchConversations } from "@/redux/conversationSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

export default function ChatInterface() {
  const dispatch = useAppDispatch();
  const { list, status } = useAppSelector(state => state.conversations);
  const loading = status === 'loading';
  
  const [selectedChat, setSelectedChat] = useState<any>(null);


  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={cn(
          "w-full md:w-1/3 lg:w-1/4 border-r bg-white dark:bg-gray-800 transition-all duration-300",
          selectedChat ? "hidden md:flex" : "flex"
        )}
      >
        <ChatList
          chats={list || []}
          loading={loading}
          onSelectChat={(chat) => setSelectedChat(chat)}
        />
      </div>

      {/* Chat Page */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-white dark:bg-gray-900 transition-all duration-300",
          !selectedChat && "hidden md:flex items-center justify-center text-gray-500"
        )}
      >
        {selectedChat ? (
          <MessagePage
            selectedChat={selectedChat}
            onBack={() => setSelectedChat(null)}
          />
        ) : (
          <p className="text-lg font-medium">Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );
}
