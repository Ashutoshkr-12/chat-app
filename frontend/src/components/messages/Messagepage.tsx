import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

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
  messages: Message[];
};

interface MessagePageProps {
  chat: Chat;
}

export default function MessagePage({ chat }: MessagePageProps) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>(chat.messages);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      sender: "me",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 overflow-y-scroll">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar>
          <AvatarImage src={chat.avatar} />
          <AvatarFallback>{chat.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{chat.name}</p>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 space-y-2">
        {chatMessages.map((msg) => (
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
    </div>
  );
}
