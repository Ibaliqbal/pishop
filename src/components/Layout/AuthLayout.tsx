import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="max-w-layout p-4 mx-auto h-screen flex items-center justify-center">
      {children}
    </main>
  );
};

export default AuthLayout;
