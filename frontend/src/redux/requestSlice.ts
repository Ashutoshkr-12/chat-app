import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { getSocket } from "@/socket/socket";
import { emitSendRequest } from "@/socket/listener";
import { jwtDecode } from "jwt-decode";

type RequestItem = { _id: string; [key: string]: any };

interface RequestState {
  incoming?: RequestItem[];
  outgoing?: RequestItem[];
  loading: boolean;
  error?: string | null;
}

interface JwtPayload {
  id?: string;
  [key: string]: any;
}

const URL = import.meta.env.VITE_APPLICATION_BACKEND_URL;


export const fetchRequests = createAsyncThunk<RequestItem[], void, { state: RootState; rejectValue: string }>("requests/fetch", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.auth?.token;

    const res = await fetch(`${URL}/request/received`, {
      method: "GET",
      headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`,},
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data.message || "Failed to fetch requests";
      toast.error(message);
      return rejectWithValue(message);
    }

    return data.data;
  } catch (error: any) {
    toast.error(error?.message || "Something went wrong");
    return rejectWithValue(error?.message);
  }
});


export const sendRequest = createAsyncThunk< RequestItem, string, { state: RootState; rejectValue: string }>("requests/send", async (receiverId, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token: string = state.auth?.token as string;
    const decode = jwtDecode<JwtPayload>(token)
    const user = decode

    if (!token) {
      const message = "Unable to access token, please re-login";
      toast.error(message);
      return rejectWithValue(message);
    }

    const res = await fetch(`${URL}/request/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json",   Authorization: `Bearer ${token}`  },
      body: JSON.stringify({ receiverId }),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      const message = data.message || "Unable to send request";
      toast.error(message);
      return rejectWithValue(message);
    }

    //console.log('request slice data:', receiverId, user?.id);
    emitSendRequest(receiverId, user.id as string)

    toast.success("Request sent successfully");
    return data;
  } catch (error: any) {
    const message = error?.message || "Something went wrong";
    toast.error(message);
    return rejectWithValue(message);
  }
});


export const acceptRequest = createAsyncThunk< RequestItem, string, { state: RootState; rejectValue: string }>("requests/accept", async (requestId, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.auth?.token;

    
    const res = await fetch(`${URL}/request/accept/${requestId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      const message = data.message || "Unable to accept request";
      toast.error(message);
      return rejectWithValue(message);
    }

    // const socket = getSocket();
    // if (socket)
    //   socket.emit("request:accept", {
    //     from: data.request.from,
    //     to: data.request.to,
    //     conversation: data.data,
    //   });

    toast.success("Request accepted");
    return data.request;
  } catch (error: any) {
    const message = error?.message || "Something went wrong";
    toast.error(message);
    return rejectWithValue(message);
  }
});


const initialState: RequestState = {
  incoming: [],
  outgoing: [],
  loading: false,
  error: null,
};

const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    addIncomingRequest: (state, action) => {
      state.incoming?.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
    //fetch request
      .addCase(fetchRequests.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchRequests.fulfilled, (s, a) => {
        s.loading = false;
        s.incoming = a.payload;
      })
      .addCase(fetchRequests.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || "Failed to fetch requests";
        toast.error(a.payload as string) || "Failed to fetch requests";
      })
      //send request
      .addCase(sendRequest.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(sendRequest.fulfilled, (s, a) => {
        s.loading = false;
        s.outgoing?.push(a.payload);
      })
      .addCase(sendRequest.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || "Failed to send request";
        toast.error(a.payload as string) || "Failed to send requests";
      })
      //accept request
      .addCase(acceptRequest.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(acceptRequest.fulfilled, (s, a) => {
        s.loading = false;
        s.incoming = s.incoming?.filter(
          (req: any) => req._id !== a.meta.arg
        );
      })
      .addCase(acceptRequest.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || "Failed to accept request";
        toast.error(a.payload as string) || "Failed to accept requests";
      });
  },
});

export const { addIncomingRequest } = requestSlice.actions;
export default requestSlice.reducer;
