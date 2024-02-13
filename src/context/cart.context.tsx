import { CartProduct, TStateCart } from "@/types/cart.type";
import { DocumentData } from "firebase/firestore";
import { ReactElement, createContext, useContext, useReducer } from "react";
import { toast } from "sonner";

type ReducerAction = {
  type: string;
  payload: (DocumentData | undefined | CartProduct)[];
};

const enum REDUCER_TYPE {
  ADD_TO_CART,
  SET_CART,
}
const initState: TStateCart = { cart: [] };

const reducer = (state: TStateCart, action: ReducerAction): TStateCart => {
  switch (action.type) {
    case `${REDUCER_TYPE.ADD_TO_CART}`:
      const selectProduct = state.cart.findIndex(
        (product) => product?.name_product === action.payload[0]?.name_product
      );
      toast.success("Successfulty add itemse to cart");
      if (selectProduct !== -1) {
        console.log("qty", state.cart[selectProduct]?.quantity);
        console.log("ada product");
        return { cart: [...state.cart] };
      } else {
        return { cart: [...state.cart, ...action.payload] };
      }
    default:
      throw new Error();
  }
};

const useCartProductsConntext = (initState: TStateCart) => {
  const [state, dispacth] = useReducer(reducer, initState);

  const handleAddToCart = (product: CartProduct) => {
    console.log(product);
    return dispacth({
      type: `${REDUCER_TYPE.ADD_TO_CART}`,
      payload: [product],
    });
  };

  return { state, handleAddToCart };
};

type UseCartProductsContext = ReturnType<typeof useCartProductsConntext>;

const initContextState: UseCartProductsContext = {
  state: initState,
  handleAddToCart: () => {},
};

export const CartProductsContext =
  createContext<UseCartProductsContext>(initContextState);

type CartProviderProps = {
  children: ReactElement | ReactElement[] | undefined;
};

export const CartProdvider = ({
  children,
}: CartProviderProps): ReactElement => {
  return (
    <CartProductsContext.Provider value={useCartProductsConntext(initState)}>
      {children}
    </CartProductsContext.Provider>
  );
};

export const useAddToCart = () => {
  const { handleAddToCart } = useContext(CartProductsContext);
  return handleAddToCart;
};

export const useCart = () => {
  const { state } = useContext(CartProductsContext);
  return state;
};
