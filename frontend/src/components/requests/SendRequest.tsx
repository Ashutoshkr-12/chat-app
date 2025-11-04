import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {  sendRequest } from "@/redux/requestSlice";
import { getSocket } from "@/socket/socket";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SendRequest = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [searchUser, setSearchUser] = useState([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  //console.log('user from send request:', user);
 


  const handleSearchUser = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_APPLICATION_BACKEND_URL}/auth/search-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search: search }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSearchUser(data.data);
        //console.log(data.data)
      }
    } catch (error) {
      toast.error("not found");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (receiverId: string) => {
    try {
      //console.log('receiverId:',receiverId);
      dispatch(sendRequest(receiverId));
    } catch (error) {
      setStatus("Error sending request. Please try again.");
    }
  };


useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearchUser();
    }, 500); 
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="p-4 border  rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Send Friend Request</h2>

      <input
        type="email"
        placeholder="Enter user email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-2 rounded-md mb-3"
      />

      {loading ? (
        <p className="text-sm text-gray-500 mb-3">Searching...</p>
      ) : Array.isArray(searchUser) && searchUser.length > 0 ? (
        <ul className="mb-3 space-y-2 h-screen ">
          {searchUser.map((user: any) => (
            <li
              key={user._id}
              className="flex items-center justify-between border p-2 rounded"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-12 h-12 rounded-full ">
                  <img
                    className="rounded-full w-full h-full object-cover"
                    src="https://img.freepik.com/free-photo/portrait-happy-smiling-woman-standing-square-sunny-summer-spring-day-outside-cute-smiling-woman-looking-you-attractive-young-girl-enjoying-summer-filtered-image-flare-sunshine_231208-6734.jpg?semt=ais_hybrid&w=740&q=80"
                    alt="profilepic"
                  />
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={()=> handleSend(user._id)}
                className="text-sm cursor-pointer border py-1 px-2 rounded-lg bg-white text-blue-700 font-semibold hover:bg-black"
              >
                send Request
              </button>
            </li>
          ))}
        </ul>
      ) : (
        search.trim() !== " " && (
          <p className="text-sm text-gray-500 mb-3">No users found</p>
        )
      )}

      {status && (
        <p className="text-center mt-3 text-sm text-green-600">{status}</p>
      )}
    </div>
  );
};

export default SendRequest;
