import { useEffect, useState } from "react";
import { ProductOrder } from "./useOrder";
import { useGetUserById } from "./useGetUserById";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type OnTheWay = {
  id: string;
  idOrder: string;
  idProduct: string;
  product: ProductOrder[];
};

export const useOnTheWay = () => {
  const [onTheWay, setOnTheWay] = useState<OnTheWay[] | null>(null);
  const [loading, setLoading] = useState<{ id: string; status: boolean }>(
    {} as { id: string; status: boolean }
  );
  const { id } = useGetUserById();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), async (snapshot) => {
      const findUser = snapshot.docs.find((doc) => doc.id === id);
      if (findUser) {
        const colRef = query(collection(findUser.ref, "on_the_way"));
        const docRef = await getDocs(colRef);
        const arrDoc = [] as any[];
        docRef.forEach((doc) => {
          const data = { ...doc.data(), id: doc.id };
          arrDoc.push(data);
        });
        setOnTheWay(arrDoc);
      }
    });

    return () => unsub();
  }, [id]);

  const confirmProductRecieved = async (
    product: ProductOrder,
    idOrder: string,
    idOtw: string
  ) => {
    const q = query(
      collection(db, "users"),
      where("username", "==", product.name_seller)
    );

    try {
      setLoading({ id: idOrder, status: true });
      const sellerRef = await getDocs(q);
      await updateDoc(doc(sellerRef.docs[0].ref, "orders", idOrder), {
        status: "order_received",
      });
      if (id) {
        const userRef = doc(db, "users", id);
        await deleteDoc(doc(userRef, "on_the_way", idOtw));
        await setDoc(doc(userRef, "gift_comments", uuidv4()), {
          idOrder,
          idProduct: product.id_product,
          product: {
            name_product: product.name_product,
            thumbnail_product: product.thumbnail,
          },
        });
      }
    } catch (error) {
      console.log(error);
      return toast.error("An error occurred in the system");
    } finally {
      setLoading({ id: idOrder, status: false });
      location.reload();
    }
  };

  return { onTheWay, loading, confirmProductRecieved };
};
