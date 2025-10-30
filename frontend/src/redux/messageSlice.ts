import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "@/lib/api";
import type { PayloadAction } from "@reduxjs/toolkit";

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

// ✅ Async thunks
export const fetchMessages = createAsyncThunk<Message[], string>(
  "messages/fetch",
  async (conversationId: string) => {
    const data = await apiFetch(`/messages/${conversationId}`);
    return data;
  }
);

export const sendMessage = createAsyncThunk<
  Message,
  { conversationId: string; text: string }
>("messages/send", async ({ conversationId, text }) => {
  const data = await apiFetch(`/messages/${conversationId}`, "POST", { text });
  return data;
});


const initialState: MessageState = {};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const msg = action.payload;
      if (!msg.conversationId) return;
      if (!state[msg.conversationId]) state[msg.conversationId] = [];
      state[msg.conversationId].push(msg);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const conversationId = action.meta.arg; // arg from thunk call
        state[conversationId] = action.payload;
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
