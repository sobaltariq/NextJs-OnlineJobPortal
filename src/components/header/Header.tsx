"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/auth/authSlice";
import { RootState } from "@/redux/store";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userRole } = useSelector(
    (state: RootState) => state.auth
  );

  const router = useRouter();

  const logoutHandler: () => void = () => {
    // localStorage.clear();
    // setIsLoggedIn(false);
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="width-container">
      <div className="header-wrapper">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          {isLoggedIn && (
            <>
              <li>
                <Link href="/user/employer">Employer</Link>
              </li>
              <li>
                <Link href="/user/job-seeker">Job Seeker</Link>
              </li>
              {userRole === "employer" && (
                <li>
                  <Link href="/jobs/my-jobs">My Jobs</Link>
                </li>
              )}
              {userRole === "job seeker" && (
                <li>
                  <Link href="/applications">My Applications</Link>
                </li>
              )}
            </>
          )}
        </ul>
        <div className="side-header">
          {isLoggedIn && (
            <>
              <input type="text" placeholder="Search..." />
              <div>
                <Link href="/profile">Profile</Link>
              </div>
            </>
          )}
          {!isLoggedIn && (
            <div className="">
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
