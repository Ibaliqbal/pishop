import { Timestamp } from "firebase/firestore";

export type dataUser = {
  [index: string]: string;
};

export type GetDataType = {
  id: string;
  username: string;
  email: string;
  password?: string;
  address: string;
  phone: string;
  isSeller: boolean;
  image: string;
  role: string;
  timestamp: Timestamp;
  followers?: number;
  followShop: string[];
  description_shop?: string;
};
