import { ReactNode } from "react";
import Navbar from "../Navbar";
import { useLocation, useParams } from "react-router-dom";
import { useGetProducts } from "@/hooks/useGetProducts";

type DefaultLayoutProps = {
  children: ReactNode;
};

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const location = useLocation();
  const products = useGetProducts();
  const { id } = useParams();
  return (
    <main className="max-w-layout px-4 pt-4 mx-auto">
      {location.pathname !== "/add_new_product" &&
        location.pathname !==
          `/edit_product/${
            products.find((product) => product.id === id)?.id
          }` && <Navbar />}
      {children}
    </main>
  );
};

export default DefaultLayout;
