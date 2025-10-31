import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import { getSocket } from "@/socket/socket";

type Message = {
  _id?: string;
  conversationId?: string;
  senderId?: string;
  text?: string;
  createdAt?: string;
  [key: string]: any;
};

type MessageState = {
  [conversationId: string]: Message[];
};

const URL = import.meta.env.VITE_APPLICATION_BACKEND_URL


export const fetchMessages = createAsyncThunk(
  "messages/fetch",
  async (conversationId: string) => {
    const res = await fetch(`/messages/${conversationId}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    return { conversationId, messages: data.data };
  }
);

export const sendMessage = createAsyncThunk<
  Message,
  { conversationId: string; text: string; receiverId: string },
  { state: RootState }
>("messages/send", async ({ conversationId, receiverId, text }, { getState }) => {
  const state = getState();
  const token = state.auth?.token;
  const user = state.auth?.user;

  const res = await fetch(`${URL}/messages/${conversationId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
    body: JSON.stringify({text}),
    credentials: 'include'
  });

  const data = await res.json();

  if(data.success){
    const socket = getSocket();
    if(socket)
      socket.emit("message:send",{
     to: receiverId,
     message: {...data.message, senderId: user?._id},
      });
  }
  return data.message;
});

const initialState: MessageState = {};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const msg = action.payload;
      if (!state[msg.conversationId]) state[msg.conversationId] = [];
      state[msg.conversationId].push(msg);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state[action.payload.conversationId] = action.payload.messages;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const msg = action.payload;
        if (!msg.conversationId) return;
        if (!state[msg.conversationId]) state[msg.conversationId] = [];
        state[msg.conversationId].push(msg);
      });
  },
});

export const { addMessage } = messageSlice.actions;
export default messageSlice.reducer;
