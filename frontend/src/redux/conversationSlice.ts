import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store';
import toast from 'react-hot-toast';

type ConversationItem = { _id: string; [key: string]: any };

interface ConversationState {
    list: ConversationItem[];
    status: { enum: 'idle' | 'loading' | 'failed' | 'success'} | any;
    
}

export const fetchConversations = createAsyncThunk<ConversationItem[], void, { state: RootState}>('conversations/fetch', async(_, {getState}) => {

  const state = getState();
  const token = state.auth?.token;
  
  const res = await fetch(`${import.meta.env.VITE_APPLICATION_BACKEND_URL}/conversations`, {
      method: "GET",
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
    })

    const data = await res.json();
    //console.log('conversation:',data)
    if(!data.success) toast.error(data.message);
    return data.data || [];
});

const initialState: ConversationState = { list: [], status: 'idle' };

const conversationSlice = createSlice({
    name: 'conversations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
    builder
    .addCase(fetchConversations.fulfilled, (state, action) => {
      state.list = action.payload; state.status = 'success';
    })
    .addCase(fetchConversations.pending, (s) => { s.status = 'loading';})
    .addCase(fetchConversations.rejected, (s) => { s.status = 'failed';})
  },
});


export default conversationSlice.reducer;