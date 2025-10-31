import { initSocket } from "@/socket/socket";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";


// export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
//   const res = await apiFetch("/auth/user/me");
//   return res.user;
// });

type User = {
   _id?: string;
   name?: string;
   email?: string;
   profileImage?: string;
}
interface loginData {
  user?:  User | null;
  token?: string | null;
  loading: boolean;
  error?:  null | string ;
}
export const loginUser = createAsyncThunk('user/loginUser',async({ email, password}: { email: string; password: string}, { rejectWithValue}) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_APPLICATION_BACKEND_URL}/auth/login`,{
      method: "POST",
      headers: { "Content-Type" : "application/json"},
      body: JSON.stringify({ email, password}),
      credentials: 'include',
    })

    const data = await res.json();
    if(!res.ok) toast.error(data.message || 'Login failed');
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
})

const initialState: loginData = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
}


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      document.cookie = "token=; Max-Age=0"
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      //console.log('data from slice:', state.user);
      state.token = action.payload.token;
      initSocket(action.payload.token);
      localStorage.setItem('token', action.payload.token);
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) ?? (action.error?.message ?? null);
    })
    
  },
});



export const { logout } = userSlice.actions;
export default userSlice.reducer;
