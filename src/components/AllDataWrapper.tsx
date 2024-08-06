"use client";
import React, { useEffect } from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { initializeAuthState } from "@/redux/features/auth/authSlice";
import Image from "next/image";

import LoadingImg from "../assets/Loader.svg";
import { setAppMainLoader } from "@/redux/features/gobalSlicer";
import { waitSec } from "@/utils/CommonWait";

const AllDataWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isChat = useSelector((state: RootState) => state.chat.isChat);
  const { isLoggedIn, userRole, isSearch } = useSelector(
    (state: RootState) => state.auth
  );
  const { appMainLoader } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuthState());
  }, [dispatch]);

  useEffect(() => {
    const setLoader = async () => {
      if (isLoggedIn) {
        dispatch(setAppMainLoader(false));
      }
      await waitSec(200);
      dispatch(setAppMainLoader(false));
    };
    setLoader();
  }, []);

  if (appMainLoader) {
    return (
      <div className="h-dvh flex justify-center items-center">
        <Image
          src={LoadingImg}
          alt="Loading"
          height={100}
          width={100}
          priority
        />
      </div>
    );
  }

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
