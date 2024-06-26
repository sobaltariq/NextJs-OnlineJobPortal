"use client";
import UserProfile from "@/components/profile/UserProfile";
import ChangePassword from "@/components/profile/ChangePassword";
import LoginAuth from "@/hocs/LoginAuth";
import composeHOCs from "@/hocs/composeHOCs";
import { setAuthData } from "@/redux/features/auth/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import EditProfile from "@/components/profile/EditProfile";

const ProfilePage = () => {
  const [editProfile, setEditProfile] = useState(false);

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

      <ChangePassword />

      <EditProfile />
    </>
  );
};

export default composeHOCs(LoginAuth)(ProfilePage);
