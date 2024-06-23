"use client";
import { Provider } from "react-redux";
import store from "./store";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <Provider store={store}>{children}</Provider>
    </>
  );
}
