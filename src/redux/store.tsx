"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/auth/authSlice";
import chatReducer from "@/redux/features/chatSlicer";
import jobsReducer from "@/redux/features/jobsSlicer";
import globalReducer from "@/redux/features/globalSlicer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    jobs: jobsReducer,
    global: globalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
