import { storage } from "@/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useStorageProducts = () => {
  const [imagesProduct, setImagesProduct] = useState<string[]>([]);
  const [error, setError] = useState<Error>();
  const [progress, setProgress] = useState<number>(0);

  const uploadImage = (file: File, sellerName: string) => {
    if (!file) return;

    const filedId = uuidv4();
    const formatFile = file.type.split("/")[1];
    console.log("ini dari custom hook", file);
    const storageRef = ref(
      storage,
      `products/${sellerName}/${filedId}.${formatFile}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (err) => {
        setError(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setProgress(0)
          setImagesProduct((prev) => [...prev, downloadURL]);
        });
      }
    );
  };

  const handleDelete = (i: number) => {
    const filterImage = imagesProduct.filter((_, index) => index !== i);
    setImagesProduct(filterImage);
  };

  return { imagesProduct, error, progress, uploadImage, handleDelete };
};

export default useStorageProducts;
