import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export type Comment = {
  rating: number;
  teks: string;
  name_customer: string;
  avatar_customer: string;
  uploadAt: number;
};

export type Products = {
  id: string;
  name_seller: string;
  image_seller: string;
  ket_product: string;
  name_product: string;
  phone_seller: number;
  price_product: number;
  category_product: { value: string; label: string }[];
  comments_product: Comment[];
  stock_product: number;
  sender_address: string;
  size_product: { value: string; label: string }[];
  product_image: string[];
  createdAt: Timestamp;
  soldout_product: number;
  spek_product: { nameSpek: string; valSpek: string }[];
  updatedAt?: Timestamp;
  ratings: number;
};

export const productSchema = z.object({
  name_product: z.string().refine((val) => val !== "", "Name product required"),
  price_product: z.number().refine((val) => val >= 0, "Must be positive"),
  ket_product: z.string().trim(),
  stock_product: z.number().refine((val) => val >= 0, "Must be positive"),
});

export type TProductSchema = z.infer<typeof productSchema>;
