import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  loginToken: String | null;
  userRole: String | null;
}

const initialState: AuthState = {
  isLoggedIn: !!localStorage.getItem("login_token"),
  loginToken: localStorage.getItem("login_token"),
  userRole: localStorage.getItem("user_role"),
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
      state.isLoggedIn = action.payload.isLoggedIn;
      state.loginToken = action.payload.token;
      state.userRole = action.payload.role;
      localStorage.setItem("login_token", action.payload.token);
      localStorage.setItem("user_role", action.payload.role);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.loginToken = null;
      state.userRole = null;
      localStorage.clear();
    },
  },
});

export const { setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
