import React, { useEffect, useState } from "react";

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
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // fetch current user details
  const getUserProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/me"); // GET current user info
      const data = await res.json();
      setUser(data.user);
      setUsername(data.user.username);
      setEmail(data.user.email);
      setPreview(data.user.profilePic);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // update user profile
  const handleUpdate = async () => {
    // const formData = new FormData();
    // formData.append("username", username);
    // formData.append("email", email);
    // if (profilePic) formData.append("profilePic", profilePic);

    // try {
    //   setLoading(true);
    //   const res = await fetch("/api/user/update", {
    //     method: "PUT",
    //     body: formData,
    //   });
    //   const data = await res.json();
    //   setMessage(data.message);
    //   getUserProfile();
    // } catch (err) {
    //   console.error(err);
    //   setMessage("Something went wrong!");
    // } finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  if (loading && !user) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4 border rounded-xl shadow-md mt-10 ">
      <h2 className="text-2xl font-semibold text-center mb-6">My Profile</h2>

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-5">
        <div className="relative">
          <img
            src={preview || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute bottom-0 left-0 w-full opacity-0 cursor-pointer"
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">Click to change photo</p>
      </div>

      {/* username */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded-md"
        />
      </div>

      {/* email */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Email</label>
        <input
          type="email"
          value={email}
          readOnly
          className="w-full border p-2 rounded-md  cursor-not-allowed"
        />
      </div>

      {/* update button */}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="bg-green-500 text-black font-semibold w-full py-2 rounded-md hover:bg-green-600"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>

      {message && <p className="text-center mt-3 text-green-600">{message}</p>}
    </div>
  );
};

export default ProfilePage;
