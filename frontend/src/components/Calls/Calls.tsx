"use client";
import { useState, useRef } from "react";
import { Video } from "lucide-react";

type User = {
  id: string;
  name: string;
  avatar: string;
};

const dummyUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
];

// const currentUser: User = {
//   id: "0",
//   name: "You",
//   avatar: "https://i.pravatar.cc/100?img=1",
// };

export default function CallPage() {
  const [inCall, setInCall] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const startCall = (user: User) => {
    setSelectedUser(user);
    setInCall(true);
    // In real app: setup WebRTC PeerConnection here
  };

  const endCall = () => {
    setInCall(false);
    setSelectedUser(null);
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gray-900 text-white py-4">
      {!inCall ? (
        <div className="w-full max-w-md">
          <h3 className="text-2xl font-semibold font-serif mb-3">Friends</h3>
          <div className="flex flex-col gap-3">
            {dummyUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-gray-800 p-3 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={() => startCall(user)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700  rounded-lg text-md flex  items-center gap-2"
                >
                     <Video />
                  <span className="font-semibold">call</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="relative w-[90%] max-w-2xl bg-black rounded-2xl overflow-hidden shadow-lg">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-[400px] bg-gray-800 object-cover"
            />
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="absolute bottom-4 right-4 w-32 h-32 bg-gray-600 rounded-lg border-2 border-white"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6">
              <button
                onClick={endCall}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full"
              >
                End Call
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold">
              You’re in a call with {selectedUser?.name}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
