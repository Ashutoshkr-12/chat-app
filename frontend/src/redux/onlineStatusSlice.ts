import { createSlice } from "@reduxjs/toolkit";

interface OnlineState {
    onlineUsers: string[];
}

const initialState: OnlineState = { onlineUsers: []};

const onlineStatusSlice = createSlice({
    name: "online",
    initialState,
    reducers: {
        setOnlineUsers: (s,a) => {
            s.onlineUsers = a.payload;
        },
        addOnlineUser: (s,a) => {
            if(!s.onlineUsers.includes(a.payload)){
                s.onlineUsers.push(a.payload);
            }
        },
        removeOnlineUser: (s,a) => {
            s.onlineUsers = s.onlineUsers.filter((id) => id !== a.payload);
        }
    }
});

export const { setOnlineUsers, addOnlineUser, removeOnlineUser} = onlineStatusSlice.actions;
export default onlineStatusSlice.reducer;