import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import assets from "@/assets/assets";

type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  messages: {
    id: number;
    sender: "me" | "other";
    text: string;
    time: string;
  }[];
};

type SidebarProps = {
  chats: Chat[];
  selectedId?: number;
};

export default function Sidebar({ chats, selectedId }: SidebarProps) {
  return (
    <div className="w-full lg:w-80 border-r bg-white dark:bg-gray-800">
      {/* Logo */}
      <div className="w-full p-2 h-16">
        <NavLink to="/">
          <img
            className="w-44 h-full object-cover"
            src={assets.chatlogo}
            alt="Chat Logo"
          />
        </NavLink>
      </div>

      {/* Chat List */}
      <ScrollArea className="h-[calc(100vh-64px)]">
        {chats.map((chat) => (
          <NavLink to={`/chat/${chat.id}`} key={chat.id}>
            <Card
              className={cn(
                "p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-none flex justify-between items-center px-6",
                selectedId === chat.id && "bg-gray-200 dark:bg-gray-700"
              )}
            >
                <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
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
                <Badge className="bg-green-500 w-8 h-8 font-bold text-sm text-white rounded-full">
                  {chat.unreadCount}
                </Badge>
              )}
              </div>
            </Card>
          </NavLink>
        ))}
      </ScrollArea>
    </div>
  );
}
