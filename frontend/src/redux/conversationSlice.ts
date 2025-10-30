import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '@/lib/api'

type ConversationItem = { _id: string; [key: string]: any };

interface ConversationState {
    list: ConversationItem[];
    loading: boolean;
}

export const fetchConversations = createAsyncThunk<ConversationItem[], void>('conversations/fetch', async() => {
    return await apiFetch('/conversations')
});

const initialState: ConversationState = { list: [], loading: false };

const conversationSlice = createSlice({
    name: 'conversations',
    initialState,
    reducers: {
         addConversation: (state, action) => {
      state.list.push(action.payload);
    },
    },
    extraReducers: (builder) => {
    builder.addCase(fetchConversations.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export const {addConversation} = conversationSlice.actions;
export default conversationSlice.reducer;