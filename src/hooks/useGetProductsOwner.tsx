import { db } from "@/firebaseConfig";
import { Products } from "@/types/products.type";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useGetProductsOwner = (id: string) => {
  const [products, setProducts] = useState<Products[]>([]);
  const docRefOwner = doc(db, "users", id);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(docRefOwner, "products"),
      (snapshot) => {
        let arr: any[] = [];
        snapshot.forEach((doc) => {
          const data = { ...doc.data(), id: doc.id };
          arr.push(data);
        });
        setProducts(arr);
      }
    );

    return () => unsubscribe();
  }, []);
  return products;
};
