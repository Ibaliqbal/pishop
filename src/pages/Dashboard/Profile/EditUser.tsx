import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { toast } from "sonner";
import { auth, db, storage } from "@/firebaseConfig";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { AiOutlineReload } from "react-icons/ai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
type EditUserProps = {
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
  data: DocumentData | null | undefined;
  user: User | null | undefined;
  id: string | undefined;
};

const SDK: string[] = [
  "Merchant harus berusia minimal 18 tahun atau sudah menikah.",
  "Merchant wajib mendaftarkan identitas diri yang valid berupa KTP atau paspor.",
  "Merchant bertanggung jawab penuh atas keaslian dan legalitas produk yang dijual.",
  "Setiap produk wajib dilengkapi deskripsi, spesifikasi, harga, dan stok yang jelas.",
  "Merchant dilarang memaksakan pembelian produk kepada pembeli dengan cara apapun.",
  "Merchant wajib mengirimkan produk tepat waktu sesuai periode pengiriman yang disepakati.",
  "Platform berhak mengenakan berbagai biaya kepada merchant seperti biaya listing, komisi, iklan dan lainnya.",
  "Merchant bertanggung jawab atas keluhan dan pengembalian produk oleh pembeli akibat ketidaksesuaian produk.",
  "Platform berhak membekukan atau menonaktifkan akun merchant yang melanggar syarat dan ketentuan.",
  "Perselisihan akan diselesaikan secara musyawarah atau melalui proses hukum jika diperlukan.",
];

const EditUser = ({ setIsOpenEdit, data, id }: EditUserProps) => {
  const [username, setUsername] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [imageUser, setImageUser] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [perc, setPerc] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const numRegex: RegExp = /^[0-9]+$/;

  useEffect(() => {
    setUsername(data?.username);
    setAddress(data?.address);
    setPhone(data?.phone);
    setImageUser(data?.image);
    setEmail(data?.email);
  }, []);

  useEffect(() => {
    const uploadFile = () => {
      const name = file?.name;

      const storageRef = ref(storage, `userprofile/${id}/${name}`);
      const files: any = file;
      const uploadTask = uploadBytesResumable(storageRef, files);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPerc(progress);
        },
        (error) => {
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            //url is download url of file
            setPerc(0);
            if (url) {
              setImageUser(url);
            }
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userCur = auth.currentUser;
    // Dibawah akan dipakai jika ingin memfilter user dengan username yang sama
    // const colRef = collection(db, "users");
    // const q = query(colRef, where("_id", "==", id ?? ""));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   console.log(doc.data());
    // });
    try {
      setLoading(true);
      if (phone) {
        if (numRegex.test(phone)) {
          if (userCur) {
            await updateDoc(doc(db, "users", id ?? ""), {
              username,
              address: address ? address : "-",
              phone: parseInt(phone),
              image: imageUser,
            });

            updateProfile(userCur, {
              displayName: username,
              photoURL: imageUser,
            });
            toast.success("Update successfuly");
            setIsOpenEdit((prev) => !prev);
          }
        } else {
          toast.error("Please enter phone input in number form");
        }
      } else {
        if (userCur) {
          await updateDoc(doc(db, "users", id ?? ""), {
            username,
            address: address ? address : "-",
            phone: phone ? phone : "-",
            image: imageUser,
          });

          updateProfile(userCur, {
            displayName: username,
            photoURL: imageUser,
          });
          toast.success("Update successfuly");
          setIsOpenEdit((prev) => !prev);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full relative flex justify-evenly p-4 gap-6">
      <IoMdArrowRoundBack
        className="absolute top-0 left-0 cursor-pointer text-2xl"
        onClick={() => setIsOpenEdit((prev) => !prev)}
      />
      {data && (
        <>
          <div className="p-6">
            <Avatar className="w-[150px] h-[150px]">
              <AvatarImage
                alt="Profile"
                src={imageUser ? imageUser : "https://github.com/shadcn.png"}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <form
            className="flex gap-6 flex-col w-[50%] p-6"
            onSubmit={handleUpdate}
          >
            <h1>Your Profile</h1>
            <div>
              <Label
                htmlFor="image"
                className="flex gap-3 items-center cursor-pointer"
              >
                Image :{" "}
                <MdOutlineDriveFolderUpload className="text-white text-2xl" />
              </Label>
              <Input
                type="file"
                id="image"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="text-black hidden"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                value={username}
                id="username"
                className="text-black"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                value={email}
                readOnly
                id="email"
                className="text-black"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                value={address ?? " "}
                id="address"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAddress(e.target.value)
                }
                className="text-black"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                type="tel"
                value={phone ?? " "}
                id="phone"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPhone(e.target.value)
                }
                className="text-black"
              />
            </div>
            {!data?.isSeller ? (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-white">
                    Do you want to become a seller ?
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3">
                    <h2>Syarat dan Ketentuan</h2>
                    <ol className="list-decimal grid gap-2 items-center">
                      {SDK.map((list, i) => {
                        return <li key={i}>{`${i + 1}. ${list}`}</li>;
                      })}
                    </ol>
                    <Button
                      className="bg-green-700 hover:bg-green-800 focus:bg-green-800 self-end"
                      type="button"
                      onClick={async () => {
                        if (data?.address !== "-" && data?.phone !== "-") {
                          setIsOpenEdit((prev) => !prev);
                          await updateDoc(doc(db, "users", id ?? ""), {
                            isSeller: true,
                          });
                          toast.success(
                            "Congratulations, now you have access to become a seller"
                          );
                        } else {
                          toast.error(
                            "Please fill your address and phone number"
                          );
                        }
                      }}
                    >
                      I Aggree
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : null}
            {loading || !(perc !== null && perc < 100) ? (
              <Button disabled className="text-white bg-green-800">
                <AiOutlineReload className="mr-2 w-4 h-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-green-700 hover:bg-green-800 focus:bg-green-800"
              >
                Submit
              </Button>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default EditUser;
