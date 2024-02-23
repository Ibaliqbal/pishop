import { db } from "@/firebaseConfig";
import { GetDataType } from "@/types/data.type";
import { DocumentData, doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

// Fungsi untuk melakukan follow sebuah toko
export const handleFollowShop = async (
  data: DocumentData | null | undefined,
  seller: DocumentData | GetDataType | undefined,
  idUser: string | undefined
) => {
  if (data?.email === seller?.email)
    return toast.error("You can't follow yourself");
  const follow = [...data?.followShop, seller?.username];
  await updateDoc(doc(db, "users", idUser ?? ""), {
    followShop: follow,
  });
  const updateFoolowers = seller?.followers
    ? seller.followers > 0
      ? seller.followers + 1
      : 1
    : seller?.followers;
  await updateDoc(doc(db, "users", seller?.id ?? ""), {
    followers: updateFoolowers,
  });
};

// fungsi untuk melakukakn unfollow sebuah toko
export const handleUnFollowShop = async (
  data: DocumentData | null | undefined,
  seller: GetDataType | undefined | DocumentData,
  idUser: string | undefined
) => {
  await updateDoc(doc(db, "users", idUser ?? ""), {
    followShop: data?.followShop.filter(
      (shop: string) => shop !== seller?.username
    ),
  });
  if (seller?.followers) {
    const updateFoolowers = seller.followers > 0 ? seller.followers - 1 : 0;
    console.log(updateFoolowers);
    console.log(seller?.id);
    await updateDoc(doc(db, "users", seller?.id ?? ""), {
      followers: updateFoolowers,
    });
  }
};
