"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    setUserRole(localStorage.getItem("user_role") || "");
    setIsLoggedIn(!!localStorage.getItem("login_token"));
  }, [isLoggedIn, userRole]);

  const logoutHandler: () => void = () => {
    localStorage.clear();
    setIsLoggedIn(false);
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
