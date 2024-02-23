import { useEffect, useState } from "react";
import { useGetUserById } from "./useGetUserById";
import {
  DocumentData,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { ProductOrder } from "./useOrder";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type Purchase = {
  name_product: string;
  detailCus: {
    nameCus: string;
    emailCus: string;
    addressCus: string;
  };
  orderId: string;
  qty: number;
  thumbnail: string;
  totalPrice: number;
  id_user: string;
  id_product: string;
  orderAt: Timestamp;
  size?: string;
  status: "pending" | "on_the_way" | "order_received";
};

export const useGetPurchase = () => {
  const [purchases, setPurchases] = useState<(Purchase | DocumentData)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
  const { id: idUser } = useGetUserById();
  useEffect(() => {
    const getPurchases = async () => {
      try {
        setLoading(true);
        if (idUser) {
          const queryP = doc(db, "users", idUser);
          const q = query(collection(queryP, "orders"));
          const snapshotquery = await getDocs(q);
          const arrDoc = [] as any[];
          snapshotquery.forEach((doc) => {
            arrDoc.push(doc.data());
          });
          setPurchases(arrDoc);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    idUser && getPurchases();
  }, [idUser]);

  const handleConfirm = async (
    id: string,
    idOrder: string,
    idProduct: string
  ) => {
    const docUser = doc(db, "users", id);
    const docOrder = doc(docUser, "order_products", idOrder);
    try {
      const dataOrder = await getDoc(docOrder);
      setLoadingConfirm(true);
      if (idUser) {
        const docSeller = doc(db, "users", idUser);
        await updateDoc(doc(docSeller, "orders", idOrder), {
          status: "on_the_way",
        });
      }
      if (dataOrder.exists()) {
        const filterOrderProduct = dataOrder
          .data()
          ?.products?.map((p: ProductOrder) => {
            if (p.id_product === idProduct) {
              return { ...p, status: "on_the_way" };
            } else {
              return p;
            }
          });
        const filterOtwProduct = filterOrderProduct.filter(
          (product: ProductOrder) => product.status !== "on_the_way"
        );
        if (filterOtwProduct.length > 0) {
          await updateDoc(docOrder, {
            products: filterOtwProduct,
          });
        } else {
          await deleteDoc(docOrder);
        }
        await setDoc(doc(docUser, "on_the_way", uuidv4()), {
          idOrder,
          idProduct,
          product: filterOrderProduct.filter(
            (product: ProductOrder) => product.status === "on_the_way"
          ),
        });
      } else {
        toast.error("Order sudah di cancel oleh customer");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingConfirm(false);
      location.reload();
    }
  };

  const handleRemoveOrder = async (idOrder: string) => {
    try {
      setLoadingConfirm(true);
      if (idUser) {
        const docUser = doc(db, "users", idUser);
        const docOrder = doc(docUser, "orders", idOrder);
        await deleteDoc(docOrder);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingConfirm(false);
      location.reload();
    }
  };

  return {
    purchases,
    loading,
    handleConfirm,
    loadingConfirm,
    handleRemoveOrder,
  };
};
