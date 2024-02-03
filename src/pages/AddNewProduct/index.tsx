import DefaultLayout from "@/components/Layout/DefaultLayout";
import Title from "@/components/Title";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IoMdArrowRoundBack, IoIosCloseCircle } from "react-icons/io";
import makeAnimated from "react-select/animated";
import Select, { MultiValue } from "react-select";
import { Button } from "@/components/ui/button";
import { MdCameraAlt, MdOutlineDriveFolderUpload } from "react-icons/md";
import { toast } from "sonner";
import useStorageProducts from "@/hooks/useStorageProducts";
import { useGetUserById } from "@/hooks/useGetUserById";
import { useState } from "react";
import { db } from "@/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AiOutlineReload } from "react-icons/ai";
import { motion } from "framer-motion";

type Props = {};
type Option = {
  value: string;
  label: string;
};

const category: Option[] = [
  { value: "Elektonik", label: "Elektonik" },
  { value: "Fashion", label: "Fashion" },
  { value: "Kesehatan & Kecantikan", label: "Kesehatan & Kecantikan" },
  { value: "Otomotif", label: "Otomotif" },
  { value: "Buku & Alat Tulis", label: "Buku & Alat Tulis" },
  {
    value: "Peralatan & Perlengkapan Rumah",
    label: "Peralatan & Perlengkapan Rumah",
  },
];
const size: Option[] = [
  { value: "SM", label: "SM" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
  { value: "XXXL", label: "XXXL" },
];
const AddNewProduct = (props: Props) => {
  const { data } = useGetUserById();
  const [loading, setLoading] = useState<boolean>(false);
  const { uploadImage, imagesProduct, handleDelete, progress } =
    useStorageProducts();
  const [categoriesProducts, setCategoriesProducts] = useState<any>([]);
  const [sizesProducts, setSizesProducts] = useState<any>([]);
  const [productName, setProductName] = useState<string>("");
  const [priceProduct, setPriceProduct] = useState<string>("");
  const [stockProduct, setStockProduct] = useState<string>("");
  const [ketProduct, setKetProduct] = useState<string>("");
  const [senderAddress, setSenderAddress] = useState<string>("");
  const navigate = useNavigate();

  const handleChangeCategory = (option: MultiValue<unknown>) => {
    setCategoriesProducts(option);
  };
  const handleChangeSizes = (option: MultiValue<unknown>) => {
    setSizesProducts(option);
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (
        productName !== "" &&
        senderAddress !== "" &&
        imagesProduct.length > 0 &&
        priceProduct !== "" &&
        ketProduct !== "" &&
        stockProduct !== "" &&
        categoriesProducts.length > 0 &&
        senderAddress !== ""
      ) {
        await addDoc(collection(db, "products"), {
          name_seller: data?.username,
          product_image: imagesProduct,
          name_product: productName,
          sender_address: senderAddress,
          price_product: parseInt(priceProduct),
          stock_product: stockProduct,
          ket_product: ketProduct,
          category_product: categoriesProducts.map(
            (data: Option) => data.value
          ),
          size_product:
            sizesProducts.length > 0
              ? sizesProducts.map((data: Option) => data.value)
              : [],
          phone_seller: data?.phone,
          comments_product: [],
          craetedAt: serverTimestamp(),
        });
        navigate("/profile");
      } else {
        toast.error("All input required");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const animatedComp = makeAnimated();
  return (
    <DefaultLayout>
      <div className="text-white px-4 pb-4 pt-8 w-full">
        <button onClick={() => history.back()} className="text-white text-2xl">
          <IoMdArrowRoundBack />
        </button>
        <Title
          size="text-2xl"
          className="text-center"
          text="Tambah Product Baru"
        />
        <div className="max-w-full rounded-md flex items-center p-2 gap-2 border-4 border-white mt-4">
          {imagesProduct.length > 0 ? (
            imagesProduct.map((image, i) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, type: "spring" }}
                key={i}
                className="relative"
              >
                <img
                  src={image}
                  alt="Gambar Product"
                  className="w-[150px] h-[150px]"
                />
                <IoIosCloseCircle
                  className="absolute top-0 right-0 text-2xl cursor-pointer font-bold text-black mix-blend-darken"
                  onClick={() => handleDelete(i)}
                />
              </motion.div>
            ))
          ) : (
            <div className="text-white h-[150px] w-full flex justify-center items-center gap-3">
              <MdCameraAlt className="text-4xl" />
              <p>Upload Image</p>
            </div>
          )}
        </div>
        <form
          className="flex flex-col gap-6 w-full min-h-[80dvh] mt-3 p-4"
          onSubmit={handleAddProduct}
        >
          <div>
            <Label
              className="flex gap-2 items-center cursor-pointer group w-[11rem]"
              htmlFor="images"
            >
              Upload your Image{" "}
              <MdOutlineDriveFolderUpload className="group-hover:animate-bounce text-lg" />
            </Label>
            <Input
              type="file"
              className="hidden"
              id="images"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                  const size = Math.round(e.target.files[0].size / 1024);
                  if (size < 1000) {
                    const sellerName = data?.username;
                    uploadImage(e.target.files[0], sellerName);
                  } else {
                    toast.error("Ukuran file terlalu besar");
                  }
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor="productName">Nama Product</Label>
            <Input
              id="productName"
              placeholder="Masukkan nama product nya"
              className="text-black"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProductName(e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor="alamatPengirim">Alamat Pengirim</Label>
            <Input
              id="alamatPengirim"
              placeholder="Masukkan alamat pengirimnya nya"
              className="text-black"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSenderAddress(e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor="price">Harga Product</Label>
            <Input
              id="price"
              placeholder="Masukkan harga product nya"
              className="text-black"
              type="number"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPriceProduct(e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor="category">Katergori Product</Label>
            <Select
              placeholder="Select your product category"
              id="category"
              options={category}
              className="text-black"
              isMulti
              components={animatedComp}
              closeMenuOnSelect={false}
              onChange={handleChangeCategory}
            />
          </div>
          <div>
            <Label htmlFor="size">
              Size Product <span>(Opsional)</span>
            </Label>
            <Select
              placeholder="Select size your product"
              id="size"
              options={size}
              className="text-black"
              isMulti
              components={animatedComp}
              closeMenuOnSelect={false}
              onChange={handleChangeSizes}
            />
          </div>
          <div>
            <Label htmlFor="jumlahProduct">Stock Product</Label>
            <Input
              type="number"
              id="jumlahProduct"
              placeholder="Masukkan jumlah product anda"
              className="text-black"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStockProduct(e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor="desc">Keterangan Product</Label>
            <Textarea
              id="desc"
              placeholder="Masukkan keterangan product nya"
              className="text-black"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setKetProduct(e.target.value)
              }
            />
          </div>
          {loading || !(progress !== null && progress < 100) ? (
            <Button disabled className="text-white bg-sky-800 self-start">
              <AiOutlineReload className="mr-2 w-4 h-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="self-start bg-sky-500 hover:bg-sky-800 focus:bg-sky-800"
            >
              Tambah
            </Button>
          )}
        </form>
      </div>
    </DefaultLayout>
  );
};

export default AddNewProduct;
