import { db } from "@/firebaseConfig";
import { GetDataType } from "@/types/data.type";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useGetUser = () => {
  const [data, setData] = useState<GetDataType[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (docs) => {
      let arr: any[] = [];
      docs.forEach((doc) => {
        let document = { ...doc.data(), id: doc.id };
        arr.push(document);
      });
      setData(arr);
    });

    return () => unsub();
  }, []);
  return data;
};
