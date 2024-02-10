import { v4 as uuidv4 } from "uuid";
import { storage } from "@/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

const useStorageProfile = () => {
  const [imageUser, setImageUser] = useState<string>("");
  const [perc, setPerc] = useState<number>(0);
  const [error, setError] = useState<Error>()

  const uploadUserProfile = (file: File, id: string) => {
    if (!file) return;

    const filedId = uuidv4();
    const formatFile = file.type.split("/")[1];
    const storageRef = ref(
      storage,
      `userprofile/${id}/${filedId}.${formatFile}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPerc(progress);
      },
      (err) => {
        setError(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPerc(0);
          setImageUser(downloadURL);
        });
      }
    );
  };

  return {uploadUserProfile, imageUser, perc, error, setImageUser}
};

export default useStorageProfile;
