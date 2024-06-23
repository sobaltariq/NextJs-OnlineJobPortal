"use client";
import CounterRedux from "@/components/redux/CounterRedux";
import composeHOCs from "@/hocs/composeHOCs";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import LoginAuth from "@/hocs/LoginAuth";

function HomePage() {
  const router = useRouter();
  const [useRole, setUseRole] = useState<string | null>(null);

  useEffect(() => {
    const loginToken = localStorage.getItem("login_token");
    const role = localStorage.getItem("user_role");

    !loginToken && router.push("/login");

    setUseRole(role);
  }, []);

  return (
    <div className="main-container">
      <Suspense fallback={<h2>Loading</h2>}>
        {useRole === "employer" ? (
          <h1>Home Employer</h1>
        ) : useRole === "job seeker" ? (
          <h1>Home Seeker</h1>
        ) : (
          <h1>Home</h1>
        )}
        <CounterRedux />
      </Suspense>
    </div>
  );
}
export default composeHOCs(LoginAuth)(HomePage);
