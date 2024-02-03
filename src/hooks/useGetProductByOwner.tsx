import { db } from "@/firebaseConfig";
import { Products } from "@/types/products.type";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useGetProductByOwner = (seller: string) => {
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      let arr: any[] = [];
      snapshot.forEach((item) => {
        // if (item.data().name_seller === "Iqbal Muthahhary") {
        // }
        const data = { ...item.data(), id: item.id };
        arr.push(data);
      });
      setProducts(arr);
    });
    return () => unsubscribe();
  }, []);

  return products;
};
