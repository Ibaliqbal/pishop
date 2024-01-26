import { ReactNode } from "react";
import Navbar from "../Navbar";

type DefaultLayoutProps = {
  children: ReactNode;
};

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <main className="max-w-[1366px] p-4 mx-auto">
      <Navbar />
      {children}
    </main>
  );
};

export default DefaultLayout;
