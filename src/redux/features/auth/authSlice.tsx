import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  loginToken: String | null;
  userRole: String | null;
  isSearch: boolean;
}

const initialState: AuthState = {
  // isLoggedIn: !!localStorage.getItem("login_token"),
  // loginToken: localStorage.getItem("login_token"),
  // userRole: localStorage.getItem("user_role"),
  isLoggedIn: false,
  loginToken: null,
  userRole: null,
  isSearch: false,
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
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.loginToken = null;
      state.userRole = null;
      localStorage.clear();
    },
    initializeAuthState: (state) => {
      // This reducer will initialize the auth state on the client side
      if (typeof window !== "undefined") {
        state.isLoggedIn = !!localStorage.getItem("login_token");
        state.loginToken = localStorage.getItem("login_token");
        state.userRole = localStorage.getItem("user_role");
      }
    },
    setSearch: (state, action: PayloadAction<boolean>) => {
      state.isSearch = action.payload;
    },
  },
});

export const { setAuthData, logout, setSearch, initializeAuthState } =
  authSlice.actions;
export default authSlice.reducer;
