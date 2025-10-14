import AppLayout from "@/components/AppLayout";
import ChatLayout from "@/components/chatInterface";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks"
import { logout, setOnlineUser, setSocketConnection, setUser } from "@/redux/userSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';


const Homepage = () => {
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  //console.log('userr:', user)

  const fetchUserDetails = async() =>{
    try {
      const res = await fetch(`${import.meta.env.VITE_APPLICATION_BACKEND_URL}/api/user/me`,{
        method: "GET",
        credentials: 'include'
      })
      const data = await res.json();

      if(data.logout){
        dispatch(logout());
        navigate('/login')
      }

        if (data.user) {
        dispatch(setUser(data.user));
      }else{
        toast.error(data.message)
      }
     // console.log('user info:',data.user)
    } catch (error) {
      console.error('Error in fetching user info from frontend:', error)
    }}

    useEffect(()=>{
      fetchUserDetails()
    },[]);

    useEffect(()=>{
      const socketConnection = io(import.meta.env.VITE_APPLICATION_BACKEND_URL, {
        auth: {
          token: localStorage.getItem('token')
        }
      })

      socketConnection.on('onlineUser',(data)=>{
        //console.log(data)
        dispatch(setOnlineUser(data))
      })

      dispatch(setSocketConnection(socketConnection))
      return () =>{
        socketConnection.disconnect();
      }
    },[])


  return (
    <AppLayout>
      <ChatLayout/>
    </AppLayout>
  )
}

export default Homepage