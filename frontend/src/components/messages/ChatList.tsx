import assets from "@/assets/assets";
import { NavLink } from "react-router-dom";
import { UserSearch } from "lucide-react";
import { useAppSelector } from "@/hooks/hooks";
import {jwtDecode} from "jwt-decode";

interface ChatListProps {
  chats: any[];
  loading?: boolean;
  onSelectChat: (chat: any) => void;
}

export default function ChatList({
  chats,
  loading,
  onSelectChat,
}: ChatListProps) {
  
interface JwtPayload {
  id?: string;
  [key: string]: any;
}

 const token = useAppSelector((state) => state.auth.token);
 const onlineUsers = useAppSelector(state => state.online.users);
 //console.log('online user:',onlineUsers)
const decodedUser = token ? jwtDecode<JwtPayload>(token) : null;
const user = decodedUser;
 //console.log(decodedUser);

   if (!decodedUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full ">
      <NavLink to={'/'}>
      <div className="border-b px-2 flex items-center justify-start w-full h-20 ">
        <img className="w-42 h-18 object-cover " src={assets.chatlogo} alt="logo" />
        </div>
        </NavLink>
      <div className="overflow-y-auto">
        {loading ? (
          <p className="p-4">Loading chats...</p>
        ) : !Array.isArray(chats) || chats.length === 0 ? (
          <p className="p-4 flex gap-2 items-center"> <UserSearch />Find friends and chat</p>
        ) : (
          chats.map((chat) => {
              const friend = chat.members.find((m: any) => m._id !== user?.id);
              const isOnline = onlineUsers.includes(friend?._id)
               if (!friend) return null; 
            return (
              
              <NavLink
                key={chat?._id}
                to={`/chat/${chat._id}`}
                className="flex items-center border-b gap-3 py-5 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => onSelectChat(chat)}
              >
                <img
                  src={friend.profileImage || "/default-avatar.png"}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 ">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    {friend.name}
                  </h3>
                  {isOnline ? (
                  
                  <p className="text-md font-bold text-green-500 ">
                    online
                  </p>
                  ) : (
                  <p className="text-md font-bold text-gray-600 ">
                    offline
                  </p>
                )}
          
                </div>
                {/* {2 > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-3 py-2 rounded-full">
                    1
                  </span>
                )} */}
             
              </NavLink>
            );
          })
        )}
      </div>
    </div>
  );
}
