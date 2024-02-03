import { AuthContext } from "@/context/auth.context";
import { db } from "@/firebaseConfig";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

export const useGetUserById = () => {
  const authContext = useContext(AuthContext);
  const [data, setData] = useState<DocumentData | null | undefined>(undefined);
  const user = authContext?.user;
  const id = authContext?.id
  useEffect(() => {
    /* Fungsi di bawah ini sama seperti fungsi onsnapshot namun ini hanya mengambil sekali data saja, namun ketika update kita tidak dapat data terbarunya lagi */
    // const getUser = async (): Promise<void> => {
    //   try {
    //     setLoading(true);
    //     if (authContext?.user) {
    //       const colRef = collection(db, "users");
    //       const docRef = doc(colRef, authContext?.user?.uid);
    //       const snapshot = await getDoc(docRef);
    //       console.log("ini dari get user", snapshot.data());
    //       setData(snapshot?.data());
    //       setIdUser(snapshot.id);
    //     } else {
    //       setData(null);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // authContext?.user?.uid && getUser();

    /* function unsub berfungsi untuk mengmabil data secara realtime ketika ada perbuahan pada db */
    const docId = authContext?.id ? authContext.id : " ";
    const unsub = onSnapshot(doc(db, "users", docId), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, [authContext?.user || authContext?.id]);

  return { data, user, id };
};
