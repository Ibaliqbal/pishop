import { Timestamp } from "firebase/firestore";

export type Products = {
  id: string;
  name_seller: string;
  ket_product: string;
  name_product: string;
  phone_seller: number;
  price_product: number;
  category_product: string[];
  comment_product: any[];
  stock_product: number;
  sender_address: string;
  size_product: string[];
  product_image: string[];
  createdAt: Timestamp;
};
