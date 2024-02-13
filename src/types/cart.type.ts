import { DocumentData } from "firebase/firestore";

export type CartProduct = {
  quantity: number;
  name_product: string;
  thumbnail: string;
  price: number;
  name_seller: string
  id_product: string
  checkout_product: boolean
}

export type TStateCart = {
  cart: (DocumentData | undefined)[] | CartProduct[];
};

