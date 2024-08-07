import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface GlobalInterface {
  appStatus: number;
  appMainLoader: boolean;
}
const initialState: GlobalInterface = {
  appStatus: 200,
  appMainLoader: true,
};

export const chatSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setAppStatus: (state, action: PayloadAction<number>) => {
      state.appStatus = action.payload;
    },
    setAppMainLoader: (state, action: PayloadAction<boolean>) => {
      state.appMainLoader = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAppStatus, setAppMainLoader } = chatSlice.actions;

export default chatSlice.reducer;
