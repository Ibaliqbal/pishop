import { db } from "@/firebaseConfig";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useGetUserById } from "./useGetUserById";

type GiftComments = {
  id: string;
  idOrder: string;
  idProduct: string;
  product: {
    name_product: string;
    thumbnail_product: string;
  };
};

export const useComments = () => {
  const [giftComments, setGiftComments] = useState<GiftComments[] | null>(null);
  const { id } = useGetUserById();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      async (snapshot) => {
        // setGiftComments(arr);
        const findUser = snapshot.docs.find((doc) => doc.id === id);
        if (findUser) {
          const colRef = query(collection(findUser.ref, "gift_comments"));
          const docRef = await getDocs(colRef);
          const arrDoc = [] as any[];
          docRef.forEach((doc) => {
            const data = { ...doc.data(), id: doc.id };
            arrDoc.push(data);
          });
          setGiftComments(arrDoc);
        }
      }
    );
    return unsubscribe;
  }, [id]);

  return { giftComments };
};
