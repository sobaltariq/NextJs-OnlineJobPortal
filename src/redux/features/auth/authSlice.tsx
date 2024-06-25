import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  loginToken: String | null;
  userRole: String | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  loginToken: null,
  userRole: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (
      state,
      action: PayloadAction<{
        isLoggedIn: boolean;
        token: string;
        role: string;
      }>
    ) => {
      state.isLoggedIn = true;
      state.loginToken = action.payload.token;
      state.userRole = action.payload.role;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.loginToken = null;
      state.userRole = null;
    },
  },
});

export const { setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
