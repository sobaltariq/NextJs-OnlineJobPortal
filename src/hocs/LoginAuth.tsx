import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginAuth = (WrappedComponent: React.ComponentType) => {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      const loginToken = localStorage.getItem("login_token");
      if (!loginToken && pathname !== "/register") {
        router.push("/login");
      }
    }, [router, pathname]);

    useEffect(() => {
      const loginToken = localStorage.getItem("login_token");
      if (loginToken && (pathname === "/register" || pathname === "/login")) {
        router.push("/profile");
      }
    }, [router, pathname]);

    return <WrappedComponent {...props} />;
  };
};

export default LoginAuth;
