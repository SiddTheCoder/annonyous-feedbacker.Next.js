import { createSlice } from "@reduxjs/toolkit";
import {IMessage} from "@/models/messages/Message";

const initialState = {
  messages: [] as IMessage[],
  loading: false,
  acceptMessage: true,
}

const messageSlice = createSlice({
  name: "messages",
  initialState: initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter((msg) => msg._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAcceptMessage: (state, action) => {
      state.acceptMessage = action.payload;
    },
  },
});

export const { addMessage, removeMessage, setMessages, setLoading, setAcceptMessage } = messageSlice.actions;
export default messageSlice.reducer;
