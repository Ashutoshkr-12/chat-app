import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/redux/authSlice'
import requestReducer from '@/redux/authSlice'
import conversationReducer from '@/redux/authSlice'
import messageReducer from '@/redux/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestReducer,
    conversations: conversationReducer,
    messages: messageReducer, 
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch