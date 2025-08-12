import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  removeMessage,
  addMessage,
  setMessages,
  setLoading,
  setAcceptMessage,
} from "./messageSlice";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export const toggleAcceptMessageStatus = createAsyncThunk(
  "messages/toggleAcceptMessageStatus",
  async (acceptingMessage: boolean, { dispatch }) => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptingMessage: acceptingMessage,
      });
      console.log("Response", response.data);
      dispatch(setAcceptMessage(response.data.isAcceptingMessages));
    } catch (error) {
      console.error("Error fetching acceptance status:", error);
    }
  }
);

export const getAcceptMessageStatus = createAsyncThunk(
  "messages/getAcceptMessageStatus",
  async (_, { dispatch }) => {
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      console.log("Response", response.data);
      dispatch(setAcceptMessage(response.data.isAcceptingMessages));
    } catch (error) {
      console.error("Error fetching acceptance status:", error);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get("/api/messages");
      dispatch(setMessages(response.data));
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }
);
