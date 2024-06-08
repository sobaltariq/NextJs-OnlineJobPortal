import React from "react";

function Page() {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <input type="email" placeholder="Email" />
        <br />
        <input type="password" placeholder="Password" />
        <br />
        <button>Login</button>
      </form>
    </div>
  );
}

export default Page;
