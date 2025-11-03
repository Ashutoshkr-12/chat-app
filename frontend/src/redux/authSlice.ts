import { initSocket } from "@/socket/socket";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

type User = {
  _id?: string;
  name?: string;
  email?: string;
  profileImage?: string;
};

interface LoginState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}


export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APPLICATION_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Server is not responding");
    }
  }
);

const initialState: LoginState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      document.cookie = "token=; Max-Age=0";
      localStorage.removeItem("token");
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
        state.user = action.payload.user; 
        state.token = action.payload.token;
        initSocket(action.payload.token);
        localStorage.setItem("token", action.payload.token);
        toast.success("Login successful ");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =  toast.error(action.payload as string)  || 'Login failed'; 
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
