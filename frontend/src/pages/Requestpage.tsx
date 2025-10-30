import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import SendRequest from "@/components/requests/SendRequest";
import ReceivedRequests from "@/components/requests/ReceivedRequest";

function Requestpage() {
    const [activeTab, setActiveTab] = useState<"send" | "received">("send");
  return (
    <AppLayout>
     
    <div className="flex flex-col items-center p-4 bg-gray-800 h-screen">
      {/* Top Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "send" ? "bg-green-500 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveTab("send")}
        >
          Send Friend Request
        </button>

        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "received" ? "bg-green-500 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveTab("received")}
        >
          Received Requests
        </button>
      </div>

      {/* Content Area */}
      <div className="w-full overflow-y-scroll h-screen max-w-md bg-gray-900 rounded-lg">
        {activeTab === "send" ? <SendRequest /> : <ReceivedRequests />}
      </div>
    </div>

    </AppLayout>
  )
}

export default Requestpage