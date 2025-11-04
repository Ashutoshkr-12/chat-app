import { createSlice } from "@reduxjs/toolkit";

interface OnlineState {
    users: string[];
}

const initialState: OnlineState = { users: []};

const onlineStatusSlice = createSlice({
    name: "online",
    initialState,
    reducers: {
        setOnlineUsers: (s,a) => {
            s.users = a.payload;
        },
        addOnlineUser: (s,a) => {
            if(!s.users.includes(a.payload)){
                s.users.push(a.payload);
            }
        },
        removeOnlineUser: (s,a) => {
            s.users = s.users.filter((id) => id !== a.payload);
        }
    }
});

export const { setOnlineUsers, addOnlineUser, removeOnlineUser} = onlineStatusSlice.actions;
export default onlineStatusSlice.reducer;