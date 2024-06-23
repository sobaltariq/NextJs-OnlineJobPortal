import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: String | null;
  userRole: String | null;
}

const initialState: AuthState = {
  token: null,
  userRole: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (
      state,
      action: PayloadAction<{ token: string; userRole: string }>
    ) => {
      state.token = action.payload.token;
      state.userRole = action.payload.userRole;
    },
    logout: (state) => {
      state.token = null;
      state.userRole = null;
    },
  },
});

export const { setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
