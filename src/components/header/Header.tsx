import Image from "next/image";
import React from "react";

import user from "../../../public/assets/user.png";
import Link from "next/link";

import "./header.scss";

function Header() {
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
          <Link href="/">
            <Image src={user} alt="user profile" height={25} width={25} />
          </Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
