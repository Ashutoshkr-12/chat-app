import { useAppSelector } from "@/hooks/hooks";
import  { useEffect, useState } from "react";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = useAppSelector(state => state.auth.token);

  // console.log(token)
  // fetch current user details

  const getUserProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_APPLICATION_BACKEND_URL}/auth/user/me`,{
        method: "GET",
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        credentials: 'include'
      }); 

      const data = await res.json();
      if(!res.ok) console.error(data.message || 'something went wrong');
     // console.log('profile data:',data)
      setUser(data.user);
      setUsername(data.user.name);
      setEmail(data.user.email);
      setProfilePic(data?.user?.profileImage);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if(token) getUserProfile();
  }, [token]);


  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   //const file = e.target.files?.[0];
    
  // };

  if (loading && !user) return <p className="w-full h-screen flex items-center justify-center mt-6">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4 border rounded-xl shadow-md mt-10 ">
      <h2 className="text-2xl font-semibold text-center mb-6">My Profile</h2>

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-5">
        <div className="relative">
          <img
            src={profilePic!}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border"
          />
          {/* <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute bottom-0 left-0 w-full opacity-0 cursor-pointer"
          /> */}
        </div>
        <p className="text-sm text-gray-500 mt-1">Click to change photo</p>
      </div>

      {/* username */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Username</label>
         <span>{username}</span>
      </div>

      {/* email */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Email</label>
<span>{email}</span>
      </div>

    
    </div>
  );
};

export default ProfilePage;
