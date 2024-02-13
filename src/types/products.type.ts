import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export type Products = {
  id: string;
  name_seller: string;
  image_seller: string;
  ket_product: string;
  name_product: string;
  phone_seller: number;
  price_product: number;
  category_product: string[];
  comments_product: any[];
  stock_product: number;
  sender_address: string;
  size_product: string[];
  product_image: string[];
  createdAt: Timestamp;
  soldout_product: number;
  spek_product: { nameSpek: string; valSpek: string }[];
  updatedAt?: Timestamp
};

export const productSchema = z.object({
  name_product: z.string().refine((val) => val !== "", "Name product required"),
  price_product: z.number().refine((val) => val >= 0, "Must be positive"),
  ket_product: z.string().trim(),
  stock_product: z.number().refine((val) => val >= 0, "Must be positive"),
});

export type TProductSchema = z.infer<typeof productSchema>;
