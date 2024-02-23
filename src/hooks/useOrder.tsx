import { Timestamp, collection, doc, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useGetUserById } from "./useGetUserById";
import { db } from "@/firebaseConfig";

export interface ProductOrder {
  quantity: number;
  name_product: string;
  thumbnail: string;
  price: number;
  name_seller: string;
  id_product: string;
  size?: string;
  status: "pending" | "on_the_way";
}

export type Order = {
  id: string;
  orderId: string;
  products: ProductOrder[];
  detail_customer: {
    nameCus: string;
    emailCus: string;
    addressCus: string;
  };
  orderAt: Timestamp;
  totalPrice: number;
};

export const useOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useGetUserById();

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        if (id) {
          const queryUser = doc(db, "users", id);
          const q = query(collection(queryUser, "order_products"));
          const snapshotquery = await getDocs(q);
          const arrDoc = [] as any[];
          snapshotquery.forEach((doc) => {
            const data = {
              ...doc.data(),
              id: doc.id,
            };
            arrDoc.push(data);
          });
          setOrders(arrDoc);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    id && getOrders();
  }, [id]);

  return { orders, loading };
};
