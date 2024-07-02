"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import user from "../../../public/assets/user.png";
import Link from "next/link";

import "./header.scss";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    // const token = localStorage.getItem("login_token");
    setIsLoggedIn(!!localStorage.getItem("login_token"));
  }, [isLoggedIn]);

  const logoutHandler: () => void = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <header className="width-container">
      <div>
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
            </>
          )}
          <li>
            <Link href="/">Categories</Link>
          </li>
          <li>
            <Link href="/jobs">Jobs</Link>
          </li>
          <li>
            <Link href="/jobs/my-jobs">My Jobs</Link>
          </li>
          <li>
            <Link href="/applications">My Applications</Link>
          </li>
          {/* <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li> */}
        </ul>
        <div className="flex gap-8">
          <input type="text" placeholder="Search..." />
          {isLoggedIn && (
            <div>
              <Image src={user} alt="user profile" height={25} width={25} />
              <div className="flex gap-2">
                <Link href="/profile">Profile</Link>
              </div>
            </div>
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
