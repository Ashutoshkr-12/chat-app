import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import assets from "@/assets/assets";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect } from "react";
import { fetchConversations } from "@/redux/conversationSlice";

type SidebarProps = {
  chat: {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    unreadCount: number;
  }[];
};

export default function ChatList({ chat }: SidebarProps) {
  
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state) => state.conversations);
  const navigate = useNavigate();
  
  useEffect(()=>{
dispatch(fetchConversations());
  },[dispatch]);
  

  //TODO: change chat to selector chats...
  return (
    <div className="w-full h-full">
      <div onClick={()=>navigate('/')} className="w-full h-18 flex  items-center">
        <img className="w-46" src={assets.chatlogo} alt="" />
      </div>
     <div className="border-b py-2 px-3 md:px-0">
        <input type="text" className="border-1 border-green-500 rounded-lg  w-full py-2  px-3" placeholder="search user" />
     </div>
     
    <ScrollArea className="h-full w-full px-2 ">
      {chat.map((chat) => (
        <NavLink key={chat.id} to={`/chat/${chat.id}`}>
          {({ isActive }) => (
            <Card
            className={cn(
              
                "p-3  cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex justify-between",
                isActive && "bg-gray-200 dark:bg-gray-700"
              )}
            >
              <div className="w-full flex justify-between items-center">
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
                  <Badge className="bg-green-500 w-8 h-8 font-bold text-sm text-white rounded-full flex items-center justify-center">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
            </Card>
          )}
        </NavLink>
      ))}
    </ScrollArea>
      </div>
  );
}
