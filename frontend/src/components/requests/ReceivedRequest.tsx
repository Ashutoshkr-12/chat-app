import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { acceptRequest, fetchRequests } from "@/redux/requestSlice";
import  { useEffect, useState } from "react";



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
    //console.log('requested Id',requestId)
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
      ) : Array.isArray(incoming) && incoming.length > 0 ? 
      (
         <ul className="mb-3 space-y-2 h-screen ">
          {incoming.map((req) => (
         <li
              key={req._id}
              className="flex items-center justify-between border p-2 rounded-lg"
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
                  <p className="font-medium">{req.from.name}</p>
                  <p className="text-sm text-gray-500">{req.from.email}</p>
                </div>
              </div>
            <button
                  type="button"
              onClick={() => handleAccept(req._id)}
              className="bg-green-500 text-white hover:bg-black  px-3 py-1 rounded-md"
              >
              Accept
            </button>
           
          </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No pending requests.</p>
      )}
    </div>
  );
};

export default ReceivedRequests;
