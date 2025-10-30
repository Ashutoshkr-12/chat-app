import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { apiFetch } from "@/lib/api";

type RequestItem = { _id: string; [key: string]: any };

interface RequestState {
    list: RequestItem[];
    loading: boolean;
}

export const fetchRequests = createAsyncThunk<RequestItem[], void>('requests/fetch', async() => {
    return await apiFetch('/request/received');
});

export const sendRequest = createAsyncThunk<RequestItem, string>('requests/send', async (receiverId: string) => {
    return await apiFetch(`/request/send/${receiverId}`, 'POST');
});

export const acceptRequest = createAsyncThunk('requests/accept', async( requestId) => {
    return await apiFetch(`/request/accept/${requestId}`,"POST")
})

const initialState: RequestState = { list: [], loading: false };

const requestSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        addIncomingRequest: (state, action: PayloadAction<RequestItem>) =>{
            state.list.unshift(action.payload);
        },
        removeRequest: (state, action: PayloadAction<string>) => {
            state.list = state.list.filter((r)=> r._id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchRequests.pending, (s)=> {s.loading = true})
        .addCase(fetchRequests.fulfilled, (s,a) => { s.loading = false; s.list = a.payload;})
        .addCase(sendRequest.fulfilled,(s,a) => {s.list.push(a.payload);});
    },
});

export const { addIncomingRequest, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
