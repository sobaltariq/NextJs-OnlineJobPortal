"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/auth/authSlice";
import { RootState } from "@/redux/store";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userRole } = useSelector(
    (state: RootState) => state.auth
  );

  const router = useRouter();
  const pathname = usePathname();

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
          <li className={`link ${pathname === "/" ? "active" : ""}`}>
            <Link href="/">Home</Link>
          </li>
          {isLoggedIn && (
            <>
              <li
                className={`link ${
                  pathname === "/user/employer" ? "active" : ""
                }`}
              >
                <Link href="/user/employer">Employer</Link>
              </li>
              <li
                className={`link ${
                  pathname === "/user/job-seeker" ? "active" : ""
                }`}
              >
                <Link href="/user/job-seeker">Job Seeker</Link>
              </li>
              {userRole === "employer" && (
                <li
                  className={`link ${
                    pathname === "/jobs/my-jobs" ? "active" : ""
                  }`}
                >
                  <Link href="/jobs/my-jobs">My Jobs</Link>
                </li>
              )}
              {userRole === "job seeker" && (
                <li
                  className={`link ${
                    pathname === "/applications" ? "active" : ""
                  }`}
                >
                  <Link href="/applications">My Applications</Link>
                </li>
              )}
            </>
          )}
        </ul>
        <div className="side-header">
          {isLoggedIn && (
            <div className="logged-in">
              <input type="text" placeholder="Search..." />
              <div
                className={`link ${pathname === "/profile" ? "active" : ""}`}
              >
                <Link href="/profile">Profile</Link>
              </div>
              {isLoggedIn && <button onClick={logoutHandler}>Logout</button>}
            </div>
          )}
          {!isLoggedIn && (
            <div className="logged-out">
              <Link
                href="/login"
                className={`link ${pathname === "/login" ? "active" : ""}`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`link ${pathname === "/register" ? "active" : ""}`}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
