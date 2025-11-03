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


export const fetchMessages = createAsyncThunk<{ conversationId: string; messages: Message[] }, string, { state: RootState }>("messages/fetch", async (conversationId: string, { getState}) => {
      const state = getState() as RootState;
      const token = state.auth?.token;


    const res = await fetch(`${URL}/messages/${conversationId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`},
      credentials: "include",
    });
    const data = await res.json();
    //console.log('message data from slice:',data.data)
    return { conversationId, messages: data.data };
  }
);

export const sendMessage = createAsyncThunk< Message, { conversationId: string | undefined; text: string; receiverId: string },{ state: RootState }>("messages/send", async ({conversationId, receiverId, text} , { getState }) => {
  const state = getState();
  const token = state.auth?.token;
  const user = state.auth?.user;

  //console.log('conversationId from frontend:', conversationId);
  const res = await fetch(`${URL}/messages/${conversationId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
    body: JSON.stringify({text, receiverId}),
    credentials: 'include'
  });

  const data = await res.json();

 if (data.success) {
  const socket = getSocket();
  if (socket) {
    socket.emit("message:send", {
      conversationId,
      text,  
    });
  }
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
