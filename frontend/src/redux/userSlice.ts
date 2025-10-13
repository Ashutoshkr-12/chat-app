import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
//import type { RootState } from '@/redux/store'

// Define a type for the slice state
interface CounterState {
    _id: string,
  name: string,
  email: string,
  profileImage?: string,
  token?: string,
  onlineUser?: string[],
  socketConnection: string | null,
}

// Define the initial state using that type
const initialState: CounterState = {
  _id: "",
  name: "",
  email: "",
  profileImage: "",
  token: "",
  onlineUser: [],
  socketConnection : null
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser : (state,action: PayloadAction<CounterState>)=>{
        state._id = action.payload._id
        state.name = action.payload.name
        state.email = action.payload.email
        state.profileImage = action.payload.profileImage
    },
    setToken : (state,action: PayloadAction<string>) =>{
        state.token = action.payload
    },
    logout: (state)=>{
         state._id = ""
        state.name = ""
        state.email = ""
        state.profileImage = ""
        state.token = "",
        state.socketConnection = null
    },
    setOnlineUser : (state,action) =>{
      state.onlineUser = action.payload
    },
    setSocketConnection: (state,action)=>{
      state.socketConnection = action.payload
    }
  },
})

export const { setUser, setToken, logout,setSocketConnection, setOnlineUser  } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
//export const selectCount = (state: RootState) => state.counter.value

export default userSlice.reducer