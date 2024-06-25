"use client";
import UserProfile from "@/components/profile/UserProfile";
import ChangePassword from "@/components/profile/ChangePassword";
import LoginAuth from "@/hocs/LoginAuth";
import composeHOCs from "@/hocs/composeHOCs";
import { setAuthData } from "@/redux/features/auth/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import EditProfile from "@/components/profile/editProfile";

const ProfilePage = () => {
  const [changePassword, setChangePassword] = useState(false);
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
      {changePassword ? (
        <ChangePassword setChangePassword={setChangePassword} />
      ) : editProfile ? (
        <EditProfile />
      ) : (
        <UserProfile setChangePassword={setChangePassword} />
      )}
    </>
  );
};

export default composeHOCs(LoginAuth)(ProfilePage);
