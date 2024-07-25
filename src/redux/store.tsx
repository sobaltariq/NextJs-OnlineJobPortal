"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlicer";
import authReducer from "@/redux/features/auth/authSlice";
import chatReducer from "@/redux/features/chatSlicer";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
