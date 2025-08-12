import { configureStore } from "@reduxjs/toolkit";
import messageReducer from './features/messages/messageSlice'

export const store = configureStore({
  reducer: {
    messages: messageReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
})


// Types for use in hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;