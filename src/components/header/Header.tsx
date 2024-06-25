"use client";
import Image from "next/image";
import React, { useState } from "react";

import user from "../../../public/assets/user.png";
import Link from "next/link";

import "./header.scss";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";

const Header: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const router = useRouter();

  const logoutHandler: () => void = () => {
    localStorage.clear();
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="width-container">
      <div>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/">Categories</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
        <div className="flex gap-8">
          <input type="text" placeholder="Search..." />
          {isLoggedIn && (
            <Link href="/profile">
              <Image src={user} alt="user profile" height={25} width={25} />
            </Link>
          )}
          {!isLoggedIn && (
            <div className="flex gap-8">
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </div>
          )}
          {isLoggedIn && <button onClick={logoutHandler}>Logout</button>}
        </div>
      </div>
    </header>
  );
};

export default Header;
