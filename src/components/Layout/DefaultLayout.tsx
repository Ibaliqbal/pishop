import { ReactNode } from "react";
import Navbar from "../Navbar";
import { useLocation } from "react-router-dom";

type DefaultLayoutProps = {
  children: ReactNode;
};

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const location = useLocation();
  return (
    <main className="max-w-layout px-4 pt-4 mx-auto">
      {location.pathname === "/add_new_product" ? null: <Navbar />}
      {children}
    </main>
  );
};

export default DefaultLayout;
