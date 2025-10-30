import { apiFetch } from "@/lib/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const res = await apiFetch("/auth/user/me");
  return res.user;
});

const userSlice = createSlice({
  name: "user",
  initialState: { currentUser: null, status: "idle" },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
