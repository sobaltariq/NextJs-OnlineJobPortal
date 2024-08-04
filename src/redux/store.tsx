"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/auth/authSlice";
import chatReducer from "@/redux/features/chatSlicer";
import jobsReducer from "@/redux/features/jobsSlicer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    jobs: jobsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
