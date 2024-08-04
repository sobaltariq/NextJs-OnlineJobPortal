"use client";
import React, { useEffect } from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { initializeAuthState } from "@/redux/features/auth/authSlice";

const AllDataWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isChat = useSelector((state: RootState) => state.chat.isChat);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuthState());
  }, [dispatch]);

  return (
    <>
      {!isChat && <Header />}
      <div className="width-container" data-chat={isChat}>
        {children}
      </div>
      {!isChat && <Footer />}
    </>
  );
};

export default AllDataWrapper;
