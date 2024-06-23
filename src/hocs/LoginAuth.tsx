import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginAuth = (WrappedComponent: React.ComponentType) => {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const pathname = usePathname();

    const loginToken = localStorage.getItem("login_token");
    useEffect(() => {
      if (!loginToken && !(pathname === "/register")) {
        router.push("/login");
      }
    }, [loginToken, router]);

    useEffect(() => {
      if (loginToken && (pathname === "/register" || pathname === "/login")) {
        router.push("/profile");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default LoginAuth;
