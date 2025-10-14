import { useState } from "react";
import Sidebar from "@/components/ChatList";
import { Outlet, useParams } from "react-router-dom";

export default function ChatLayout() {
  const [chats] = useState([
    {
      id: 1,
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      lastMessage: "Hey, how are you?",
      unreadCount: 2,
      messages: [
        { id: 1, sender: "other" as "other", text: "Hey, how are you?", time: "10:00 AM" },
        { id: 2, sender: "me" as "me", text: "I’m good, you?", time: "10:02 AM" },
      ],
    },
    {
      id: 2,
      name: "Sarah Smith",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      lastMessage: "See you soon!",
      unreadCount: 0,
      messages: [
        { id: 1, sender: "other" as "other", text: "See you soon!", time: "9:15 AM" },
      ],
    },
  ]);

  const { id } = useParams();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          id ? "hidden md:flex" : "flex"
        } w-full md:w-1/3 lg:w-1/4`}
      >
        <Sidebar chats={chats} selectedId={id ? Number(id) : undefined} />
      </div>

      {/* Chat Window */}
      <div
        className={`${
          id ? "flex" : "hidden md:flex"
        } flex-1 flex-col bg-white dark:bg-gray-900`}
      >
        {/* 👇 Pass chats to child route */}
        <Outlet context={{ chats }} />
      </div>
    </div>
  );
}
