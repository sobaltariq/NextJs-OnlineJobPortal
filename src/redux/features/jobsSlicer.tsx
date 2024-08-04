import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface JobsInterface {
  jobDeleted: boolean;
}
const initialState: JobsInterface = {
  jobDeleted: false,
};

export const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    isJobDeleted: (state, action: PayloadAction<boolean>) => {
      state.jobDeleted = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { isJobDeleted } = jobsSlice.actions;

export default jobsSlice.reducer;
