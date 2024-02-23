import { CartProduct } from "@/types/cart.type";
import React, {
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type CheckoutContextType = {
  products: CartProduct[];
  handleCheckoutProducts: (products: CartProduct[]) => void;
  setProducts: React.Dispatch<SetStateAction<CartProduct[]>>;
};

type CheckoutProviderProps = {
  children: ReactNode;
};

export const CheckoutContext = createContext<CheckoutContextType | null>(null);

export const CheckoutProvider = ({ children }: CheckoutProviderProps) => {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const handleCheckoutProducts = (products: CartProduct[]) => {
    sessionStorage.setItem("checkout", JSON.stringify(products));
    setProducts(products);
  };
  return (
    <CheckoutContext.Provider
      value={{ products, handleCheckoutProducts, setProducts }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckoutProducts = () => {
  const checkout = useContext(CheckoutContext);

  return checkout?.handleCheckoutProducts;
};
