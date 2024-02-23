import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { User } from "firebase/auth";
import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { toast } from "sonner";
import { auth, db } from "@/firebaseConfig";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { AiOutlineReload } from "react-icons/ai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useGetUser } from "@/hooks/useGetUser";
import useStorageProfile from "@/hooks/useStorageProfile";
import { Textarea } from "@/components/ui/textarea";
type EditUserProps = {
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
  data: DocumentData | null | undefined;
  user: User | null | undefined;
  id: string | undefined;
};

const SDK: string[] = [
  "Seller harus berusia minimal 18 tahun atau sudah menikah.",
  "Seller wajib mendaftarkan identitas diri yang valid berupa KTP atau paspor.",
  "Seller bertanggung jawab penuh atas keaslian dan legalitas produk yang dijual.",
  "Setiap produk wajib dilengkapi deskripsi, spesifikasi, harga, dan stok yang jelas.",
  "Seller dilarang memaksakan pembelian produk kepada pembeli dengan cara apapun.",
  "Seller wajib mengirimkan produk tepat waktu sesuai periode pengiriman yang disepakati.",
  "Platform berhak mengenakan berbagai biaya kepada seller seperti biaya listing, komisi, iklan dan lainnya.",
  "Seller bertanggung jawab atas keluhan dan pengembalian produk oleh pembeli akibat ketidaksesuaian produk.",
  "Platform berhak membekukan atau menonaktifkan akun seller yang melanggar syarat dan ketentuan.",
  "Perselisihan akan diselesaikan secara musyawarah atau melalui proses hukum jika diperlukan.",
  "Setiap menerima order akan di kena potong 4%",
];

const EditUser = ({ setIsOpenEdit, data, id }: EditUserProps) => {
  const [username, setUsername] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const dataUser = useGetUser();
  const { uploadUserProfile, perc, imageUser, setImageUser } =
    useStorageProfile();
  const [descriptionShop, setDescriptionShop] = useState<string>("");
  const numRegex: RegExp = /^[0-9]+$/;

  useEffect(() => {
    setUsername(data?.username);
    setAddress(data?.address);
    setPhone(data?.phone);
    setImageUser(data?.image);
    setEmail(data?.email);
    data?.isSeller
      ? setDescriptionShop(data?.description_shop)
      : setDescriptionShop("");
  }, []);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userCur = auth.currentUser;
    // Dibawah akan dipakai jika ingin memfilter user dengan username yang sama
    // const colRef = collection(db, "products");
    // const q = query(colRef, where("name_seller", "==", data?.username));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   console.log(doc.ref);
    // });
    try {
      setLoading(true);
      const check = dataUser.find((user) => user.phone === phone);

      if (check?.username !== data?.username)
        return toast.error("Phone allready used");

      if (!numRegex.test(phone))
        return toast.error("Please enter phone input is number");
      if (userCur) {
        !data?.isSeller
          ? await updateDoc(doc(db, "users", id ?? ""), {
              username,
              address: address ? address : "-",
              phone: phone,
              image: imageUser,
            })
          : await updateDoc(doc(db, "users", id ?? ""), {
              username,
              address: address ? address : "-",
              phone: phone,
              image: imageUser,
              description_shop: descriptionShop,
            });

        if (data?.isSeller) {
          const colRef = collection(db, "allproducts");
          const q = query(colRef, where("name_seller", "==", data?.username));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {
              name_seller: username,
              image_seller: imageUser,
              phone_seller: phone,
            });
          });
        }

        updateProfile(userCur, {
          displayName: username,
          photoURL: imageUser,
        });
        toast.success("Update successfuly");
        setIsOpenEdit((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full relative flex md:flex-row flex-col justify-evenly p-4 gap-6">
      <IoMdArrowRoundBack
        className="absolute top-0 left-5 cursor-pointer text-2xl"
        onClick={() => setIsOpenEdit((prev) => !prev)}
      />
      {data && (
        <>
          <div className="p-6 self-center md:self-start">
            <Avatar className="w-[150px] h-[150px] lg:w-[250px] lg:h-[250px] md:w-[200px] md:h-[200px]">
              <AvatarImage
                alt="Profile"
                src={imageUser ? imageUser : "https://github.com/shadcn.png"}
              />
              <AvatarFallback className="text-black">CN</AvatarFallback>
            </Avatar>
          </div>
          <form
            className="flex gap-6 flex-col md:w-[50%] p-6 w-full"
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
                    const size = Math.round(e.target.files[0].size / 1024);
                    if (size < 1000) {
                      uploadUserProfile(e.target.files[0], id ?? "");
                    } else {
                      toast.error("Ukuran file terlalu besar");
                    }
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
            ) : (
              <div>
                <Label htmlFor="description-shop">Description Shop</Label>
                <Textarea
                  id="description-shop"
                  placeholder="Input your description shop"
                  value={descriptionShop}
                  className="text-black"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setDescriptionShop(e.target.value)
                  }
                />
              </div>
            )}
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
