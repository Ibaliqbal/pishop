import {
  DocumentData,
  QuerySnapshot,
  Timestamp,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useGetUserById } from "./useGetUserById";
import { db } from "@/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { CartProduct } from "@/types/cart.type";

export type Profit = {
  id: string;
  profitAt: Timestamp;
  profitUpdate: number;
};

export const useProfit = () => {
  const [profits, setProfit] = useState<Profit[]>([]);
  const { id } = useGetUserById();
  const userRef = doc(db, "users", id ?? "");
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(userRef, "profit"),
      (snapshot) => {
        const arrDoc = [] as any[];
        snapshot.forEach((snapshot) => {
          const data = {
            ...snapshot.data(),
            id: snapshot.id,
          };
          arrDoc.push(data);
        });
        setProfit(arrDoc);
      }
    );

    return () => unsubscribe();
  }, []);

  const increaseProfit = async (
    queryUserP: QuerySnapshot<DocumentData, DocumentData>,
    product: CartProduct | DocumentData
  ) => {
    await setDoc(doc(queryUserP.docs[0].ref, "profit", uuidv4()), {
      profitAt: serverTimestamp(),
      profitUpdate: Math.round(
        product.price * product.quantity -
          (product.price * product.quantity * 4) / 100
      ),
    });
    await updateDoc(doc(db, "users", queryUserP.docs[0].id), {
      e_wallet:
        queryUserP.docs[0].data().e_wallet +
        Math.round(
          product.price * product.quantity -
            (product.price * product.quantity * 4) / 100
        ),
    });
  };

  return { profits, increaseProfit };
};
