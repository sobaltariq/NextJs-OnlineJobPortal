import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ChatInterface {
  isChat: boolean;
}
const initialState: ChatInterface = {
  // isChat: false,
  isChat: true,
};

export const chatSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    isChatEnabled: (state, action: PayloadAction<boolean>) => {
      state.isChat = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { isChatEnabled } = chatSlice.actions;

export default chatSlice.reducer;
