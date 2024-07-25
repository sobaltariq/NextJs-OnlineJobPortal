"use client";
import React from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const AllDataWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isChat = useSelector((state: RootState) => state.chat.isChat);

  return (
    <>
      {!isChat && <Header />}
      <div className="width-container">{children}</div>
      {!isChat && <Footer />}
    </>
  );
};

export default AllDataWrapper;
