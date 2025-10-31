import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { getSocket } from "@/socket/socket";

type RequestItem = { _id: string; [key: string]: any };

interface RequestState {
    incoming?: RequestItem[];
    outgoing?: RequestItem[];
    loading: boolean;
    error?: string | null;
}

const URL = import.meta.env.VITE_APPLICATION_BACKEND_URL
export const fetchRequests = createAsyncThunk<RequestItem[], void, {state: RootState}>('requests/fetch', async(_, {getState}) => {
     const state = getState();
    const token = state.auth?.token
    const res =  await fetch(`${URL}/request/received`,{
        method: "GET",
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
    });
    
    const data = await res.json();

    
        if(!data.success) toast.error(data.message);
    
   
    return data.data;
});

export const sendRequest = createAsyncThunk<RequestItem, string, { state: RootState}>('requests/send', async (receiverId, {getState}) => {
    const state = getState();
    const token = state.auth?.token
    const user = state.auth?.user
    if(!token) toast.error('Unable to access token please re-login');
    //console.log('token:',token);
    const res = await fetch(`${URL}/request/send`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify({receiverId}),
        credentials: 'include',
    })
    const data = await res.json();
    if(data.success){ 
     const socket = getSocket();
     if(socket) socket.emit("request:send", { to: receiverId, from: user?._id});
    toast.success('Request sent')
    }else{
        toast.error(data.message)
    };
    return data;
});

export const acceptRequest = createAsyncThunk<RequestItem, string, {state: RootState}>('requests/accept', async( requestId, {getState}) => {
    
    const state = getState();
    const token = state.auth?.token;
    
    const res = await fetch(`${URL}/request/accept/${requestId}`,{
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`
        }

    })

    const data = await res.json();

    if(data.success){
        const socket = getSocket();
        if(socket)
            socket.emit("request:accept", {
        from: data.request.from,
        to: data.request.to,
        conversation: data.data 
            });
    }

    return data.request;
})

const initialState: RequestState = { incoming: [],outgoing:[], loading: false, error: null };

const requestSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        addIncomingRequest: (state, action) =>{
           state.incoming?.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchRequests.fulfilled, (s,a) => { s.incoming =  a.payload;})
        .addCase(sendRequest.fulfilled,(s,a) => {s.outgoing?.push(a.payload);})
        .addCase(acceptRequest.fulfilled, (s,a)=> {s.incoming = s.incoming?.filter((req: any) => req._id  !== a.meta.arg)})
    },
});

export const { addIncomingRequest } = requestSlice.actions;
export default requestSlice.reducer;
