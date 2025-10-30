import { useEffect, useState } from "react";
import MessagePage from "@/components/messages/Messagepage";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import ChatList from "@/components/messages/ChatList";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getSocket } from "@/socket/socket";

type Message = {
  id: number;
  sender: "me" | "other";
  text: string;
  time: string;
};

type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
};

export default function ChatLayout() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      lastMessage: "Hey, how are you?",
      unreadCount: 2,
      messages: [
        { id: 1, sender: "other", text: "Hey, how are you?", time: "10:00 AM" },
      
        { id: 2, sender: "me", text: "I’m good, you?", time: "10:02 AM" },
      ],
    },
    {
      id: 2,
      name: "Sarah Smith",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      lastMessage: "See you soon!",
      unreadCount: 0,
      messages: [
        { id: 1, sender: "other", text: "See you soon!", time: "9:15 AM" },
      ],
    },
  ]);
    const { id: conversationId } = useParams();
  const dispatch = useAppDispatch();
  const socket = getSocket();

  const [text, setText] = useState("");

  const user = useAppSelector((state) => state.auth.user);
  const messages = useAppSelector(
    (state) => state.messages[conversationId] || []
  );
  const conversations = useAppSelector((state) => state.conversations.list || []);

  // Fetch all conversations 
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  //Fetch messages whenever user selects a conversation
  useEffect(() => {
    if (conversationId) {
      dispatch(fetchMessages(conversationId));
      if (socket) {
        socket.emit("join-conversation", conversationId);
      }
    }
  }, [dispatch, socket, conversationId]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (msg) => {
      if (msg.conversationId === conversationId) {
        dispatch(addMessage(msg));
      }
    };

    socket.on("receive-message", handleIncoming);
    return () => socket.off("receive-message", handleIncoming);
  }, [socket, dispatch, conversationId]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !conversationId) return;

    const msg = {
      conversationId,
      senderId: user._id,
      text,
    };

    // send to backend via socket
    socket.emit("send-message", msg);
    // show instantly
    dispatch(addMessage(msg));
    setText("");
  };

  const selectedChat = conversations.find(
    (chat) => chat._id === conversationId
  );

  return (
    <div className="flex h-screen overflow-y-hidden">
      {/* Sidebar (hide on mobile when chat open) */}
      <div
        className={cn(
          "w-full md:w-1/3 lg:w-1/4 border-r-2 bg-white dark:bg-gray-800   transition-all duration-300",
          selectedChat ? "hidden md:flex" : "flex"
        )}
      >
        <ChatList chat={chats} />
      </div>

      {/* Message Page */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-white dark:bg-gray-900",
          !selectedChat && "hidden md:flex items-center justify-center text-gray-500"
        )}
      >
        {selectedChat ? (
          <MessagePage chat={selectedChat} />
        ) : (
          <p className="text-lg font-medium">Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );
}
