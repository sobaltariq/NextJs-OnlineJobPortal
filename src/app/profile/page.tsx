"use client";
import UserProfile from "@/components/profile/UserProfile";
import LoginAuth from "@/hocs/LoginAuth";
import composeHOCs from "@/hocs/composeHOCs";
import { setAuthData } from "@/redux/features/auth/authSlice";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProfilePage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("login_token");
    const role = localStorage.getItem("user_role");
    if (token && role) {
      dispatch(setAuthData({ isLoggedIn: true, token, role }));
    }
  }, [dispatch]);

  return (
    <>
      <UserProfile />
    </>
  );
};

export default composeHOCs(LoginAuth)(ProfilePage);
