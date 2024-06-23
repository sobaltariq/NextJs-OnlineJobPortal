"use client";
import Image from "next/image";
import React from "react";

import user from "../../../public/assets/user.png";
import Link from "next/link";

import "./header.scss";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const router = useRouter();

  const logoutHandler: () => void = () => {
    // localStorage.removeItem("login_token");
    localStorage.clear();
    // console.log("Logout");
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
        <div className="profile">
          <input type="text" placeholder="Search..." />
          <Link href="/profile">
            <Image src={user} alt="user profile" height={25} width={25} />
          </Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
          <button onClick={logoutHandler}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
