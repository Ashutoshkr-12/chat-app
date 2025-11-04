import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/redux/authSlice'
import requestReducer from '@/redux/requestSlice'
import conversationReducer from '@/redux/conversationSlice'
import messageReducer from '@/redux/messageSlice'
import onlineStatusReducer from '@/redux/onlineStatusSlice'
export const store = configureStore({
  reducer: {
    auth: userReducer,
    online: onlineStatusReducer,
    requests: requestReducer,
    conversations: conversationReducer,
    messages: messageReducer, 
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch