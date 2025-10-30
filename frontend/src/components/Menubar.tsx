import { MessageSquareText, UserSearch } from "lucide-react";
import { PhoneCall } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NavLink } from "react-router-dom";


const Sidebar = () => {

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-background border-t border-border p-2 md:p-0 md:top-0 md:left-0 md:h-full md:w-14 md:border-r md:border-t-0 z-10">
      <div className="flex flex-1/4 justify-around md:flex-col md:h-full md:pt-8 md:gap-8 items-center">
        <NavLink to={"/"}>
          <button className="active:bg-slate-200 flex flex-col items-center active:text-black px-4 py-4 rounded-lg">
            <MessageSquareText />
            Chats
          </button>
        </NavLink>
        <NavLink to={"/calls"}>
          <button className="active:bg-slate-200 active:text-black flex flex-col items-center px-4 py-4 rounded-lg">
            <PhoneCall />
            Calls
          </button>
        </NavLink>

        <NavLink to={"/requests"}>
          <button className="active:bg-slate-200 flex flex-col items-center active:text-black px-4 py-4 rounded-lg">
            <UserSearch />
            <span className="font-semibold">Find friends</span>
          </button>
        </NavLink>

        <NavLink to={"/profile"}>
          <Avatar className="w-10 h-10">
                <AvatarImage
                  className="object-cover"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSLB3dCjzQJDBy3zYLaW77GavvTpWYrDNWhg&s"
                />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              </NavLink>
        <button></button>
      </div>
    </nav>
  );
};

export default Sidebar;
