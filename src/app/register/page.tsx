"use client";
import LoginAuth from "@/hocs/LoginAuth";
import composeHOCs from "@/hocs/composeHOCs";
import React from "react";

function RegisterPage() {
  return (
    <div>
      <h1>Register</h1>
      <form>
        <input type="text" placeholder="Name" />
        <br />
        <input type="email" placeholder="Email" />
        <br />
        <input type="password" placeholder="Password" />
        <br />
        <input type="password" placeholder="Confirm Password" />
        <br />
        <select name="role" id="role">
          <option value="" disabled>
            Select Role
          </option>
          <option value="seeker">Seeker</option>
          <option value="employer">Employer</option>
        </select>
        <br />
        <button>Register</button>
      </form>
    </div>
  );
}

export default composeHOCs(LoginAuth)(RegisterPage);
