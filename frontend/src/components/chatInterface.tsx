import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import assets from "@/assets/assets";
import { NavLink } from "react-router-dom";

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

export default function ChatApp() {
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

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setChats((prev) =>
      prev.map((c) =>
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: "me",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, newMsg],
              lastMessage: message,
            }
          : chat
      )
    );

    setSelectedChat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev
    );

    setMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={cn(
        "w-full md:w-1/3 lg:w-1/4 border-r bg-white dark:bg-gray-800 transition-all duration-300",
        selectedChat ? "hidden md:flex" : "flex"
      )}>
        <div className="w-full">
          <NavLink to={'/'} >
          <div className="w-full p-2 h-16">
         <img className="w-44 h-full object-cover"  src={assets.chatlogo} alt="" />
          </div>
          </NavLink>
        
        <ScrollArea className="h-[calc(100vh-64px)]">
          {chats.map((chat) => (
            <Card
              key={chat.id}
              className={cn(
                "p-3 cursor-pointer  hover:bg-gray-200 dark:hover:bg-gray-700 rounded-none flex  px-6 justify-between",
                selectedChat?.id === chat.id && "bg-gray-200 dark:bg-gray-700"
              )}
              onClick={() => handleSelectChat(chat)}
            >
              <div className="flex  items-center gap-3">
                <Avatar>
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{chat.name}</p>
                  <p className="text-sm text-gray-500 truncate w-32">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
              {chat.unreadCount > 0 && (
                <Badge className="bg-green-500 text-white rounded-full">
                  {chat.unreadCount}
                </Badge>
              )}
            </Card>
          ))}
        </ScrollArea>
      </div>
      </div>

      {/* Chat Window */}
      <div className={cn(
        "flex-1 flex flex-col bg-white dark:bg-gray-900",
        !selectedChat && "hidden md:flex items-center justify-center text-gray-500"
      )}>
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSelectedChat(null)}
              >
                ←
              </Button>
              <Avatar>
                <AvatarImage src={selectedChat.avatar} />
                <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedChat.name}</p>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 space-y-2">
              {selectedChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[75%] px-4 py-2 rounded-xl",
                    msg.sender === "me"
                      ? "ml-auto bg-green-500 text-white"
                      : "mr-auto bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                  )}
                >
                  <p>{msg.text}</p>
                  <span className="block text-[10px] text-right text-gray-300">
                    {msg.time}
                  </span>
                </div>
              ))}
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} className="bg-green-500 text-white">
                Send
              </Button>
            </div>
          </>
        ) : (
          <p className="text-lg font-medium">Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );
}
