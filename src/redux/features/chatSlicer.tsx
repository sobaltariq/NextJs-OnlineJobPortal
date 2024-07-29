import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ChatInterface {
  isChat: boolean;
  chatApplicationId: string;
}
const initialState: ChatInterface = {
  // isChat: false,
  isChat: true,
  chatApplicationId: "",
};

export const chatSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    isChatEnabled: (state, action: PayloadAction<boolean>) => {
      state.isChat = action.payload;
    },
    setChatApplicationId: (state, action: PayloadAction<string>) => {
      state.chatApplicationId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { isChatEnabled, setChatApplicationId } = chatSlice.actions;

export default chatSlice.reducer;
