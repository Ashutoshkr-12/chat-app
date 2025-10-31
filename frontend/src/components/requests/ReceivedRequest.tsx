import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { acceptRequest, fetchRequests } from "@/redux/requestSlice";
import  { useEffect, useState } from "react";

interface Request {
  id: string;
  fromUser: string;
}

const ReceivedRequests = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
   const {incoming} = useAppSelector((state) => state.requests);

   console.log(incoming);

   useEffect(() => {
    dispatch(fetchRequests())
  }, [dispatch]);

  const handleAccept = (requestId: string) => {
    setLoading(true);
    try {
      dispatch(acceptRequest(requestId as any))
    } catch (err) {
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

 

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Received Requests</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : Array.isArray(incoming) && incoming.length > 0 ? (
          incoming.map((req) => (
          <div
            key={req.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{req.from?.name}</span>
            <button
              onClick={() => handleAccept(req._id)}
              className="bg-green-500 text-white px-3 py-1 rounded-md"
            >
              Accept
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No pending requests.</p>
      )}
    </div>
  );
};

export default ReceivedRequests;
