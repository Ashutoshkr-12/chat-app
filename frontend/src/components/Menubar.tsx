import { MessageSquareText, UserSearch } from "lucide-react";
import { PhoneCall } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";


const Sidebar = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const token = useAppSelector(state => state.auth.token);
  
  const currentUser = async() => {
     try {
      const res = await fetch(`${import.meta.env.VITE_APPLICATION_BACKEND_URL}/auth/user/me`,{
        method: "GET",
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        credentials: 'include'
      }); 

      const data = await res.json();
      if(!res.ok) console.error(data.message || 'something went wrong');
      //console.log('profile data:',data)
    
      setProfilePic(data?.user?.profileImage);
      
    } catch (err) {
      console.error(err);
    } 
  }
  
  useEffect(()=> {
    currentUser();
  },[])

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
                  src={profilePic ?? undefined}
                />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              </NavLink>
        
      </div>
    </nav>
  );
};

export default Sidebar;
