import { MessageSquareText } from "lucide-react";
import { PhoneCall } from "lucide-react";
import { CircleFadingArrowUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NavLink } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Sidebar = () => {

    const [name, setName] = useState('');
    const [file, setFile] = useState(null);


  return (
    <nav className="fixed bottom-0 left-0 w-full bg-background border-t border-border p-2 md:p-0 md:top-0 md:left-0 md:h-full md:w-14 md:border-r md:border-t-0 z-10">
      <div className="flex flex-1/4 justify-around md:flex-col md:h-full md:pt-8 md:gap-8 items-center">
        <NavLink to={"/"}>
          <button className="active:bg-slate-200 flex flex-col items-center active:text-black px-4 py-4 rounded-lg">
            <MessageSquareText />
            Chats
          </button>
        </NavLink>
        <NavLink to={"/"}>
          <button className="active:bg-slate-200 active:text-black flex flex-col items-center px-4 py-4 rounded-lg">
            <PhoneCall />
            Calls
          </button>
        </NavLink>

        <NavLink to={"#"}>
          <button className="active:bg-slate-200 flex flex-col items-center active:text-black px-4 py-4 rounded-lg">
            <CircleFadingArrowUp />
            Status
          </button>
        </NavLink>

        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              <Avatar className="w-10 h-10">
                <AvatarImage
                  className="object-cover"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSLB3dCjzQJDBy3zYLaW77GavvTpWYrDNWhg&s"
                />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="w-full flex justify-center">
                 <Avatar className="w-24 h-24">
                <AvatarImage
                  className="object-cover"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSLB3dCjzQJDBy3zYLaW77GavvTpWYrDNWhg&s"
                />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              </MenubarItem>
              <MenubarItem>
                <Input type="text" placeholder="name" onChange={(e)=>setName(e.target.value)}/>
              </MenubarItem>
              <MenubarItem>
                <Input placeholder="email"/>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Button className="w-full">Logout</Button>
              </MenubarItem>
              <MenubarSeparator />
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <button></button>
      </div>
    </nav>
  );
};

export default Sidebar;
