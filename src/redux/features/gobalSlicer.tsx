import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface GlobalInterface {
  appStatus: number;
}
const initialState: GlobalInterface = {
  appStatus: 200,
};

export const chatSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setAppStatus: (state, action: PayloadAction<number>) => {
      state.appStatus = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAppStatus } = chatSlice.actions;

export default chatSlice.reducer;
