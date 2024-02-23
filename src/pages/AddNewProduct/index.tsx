import DefaultLayout from "@/components/Layout/DefaultLayout";
import Title from "@/components/Title";
import { IoMdArrowRoundBack, IoIosCloseCircle } from "react-icons/io";
import { MultiValue } from "react-select";
import { MdCameraAlt } from "react-icons/md";
import { toast } from "sonner";
import useStorageProducts from "@/hooks/useStorageProducts";
import { useGetUserById } from "@/hooks/useGetUserById";
import { useState } from "react";
import { db } from "@/firebaseConfig";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import FormProduct from "@/components/Fragments/FormProduct";
import { useForm } from "react-hook-form";
import { TProductSchema, productSchema } from "@/types/products.type";
import { zodResolver } from "@hookform/resolvers/zod";

type Option = {
  value: string;
  label: string;
};

const AddNewProduct = () => {
  const { data, id } = useGetUserById();
  const { imagesProduct, handleDelete, uploadImage, progress } =
    useStorageProducts();
  const [categoriesProducts, setCategoriesProducts] =
    useState<MultiValue<unknown>>();
  const [sizesProducts, setSizesProducts] = useState<MultiValue<unknown>>();
  const [errorCate, setErrorCate] = useState<string>("");
  const [spekProduct, setSpekProduct] = useState<
    {
      nameSpek: string;
      valSpek: string;
    }[]
  >([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TProductSchema>({
    resolver: zodResolver(productSchema),
  });
  const navigate = useNavigate();

  const handleChangeCategory = (option: MultiValue<unknown>) => {
    setCategoriesProducts(option);
  };
  const handleChangeSizes = (option: MultiValue<unknown>) => {
    setSizesProducts(option);
  };

  const onSubmitAddProduct = async (dataForm: TProductSchema) => {
    const query = doc(db, "users", id ?? "");
    const idDoc = uuidv4();
    try {
      if (categoriesProducts) {
        await setDoc(doc(query, "products", idDoc), {
          ...dataForm,
          price_product: dataForm.price_product,
          name_seller: data?.username,
          product_image: imagesProduct,
          sender_address: data?.address,
          category_product: categoriesProducts,
          size_product: sizesProducts ? sizesProducts : [],
          phone_seller: data?.phone,
          comments_product: [],
          createdAt: serverTimestamp(),
          soldout_product: 0,
          image_seller: data?.image,
          spek_product: spekProduct,
          ratings: 0,
        });
        await setDoc(doc(db, "allproducts", idDoc), {
          ...dataForm,
          price_product: dataForm.price_product,
          name_seller: data?.username,
          product_image: imagesProduct,
          sender_address: data?.address,
          category_product: categoriesProducts,
          size_product: sizesProducts ? sizesProducts : [],
          phone_seller: data?.phone,
          comments_product: [],
          createdAt: serverTimestamp(),
          soldout_product: 0,
          image_seller: data?.image,
          spek_product: spekProduct,
          ratings: 0,
        });
        toast.success("Product uploaded successfully");
        navigate("/profile");
      } else {
        setErrorCate("Choose option at least one option");
      }
    } catch (error) {
      console.log(error);
    }
  };
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
        <FormProduct
          isSubmitting={isSubmitting}
          data={data}
          handleSubmitForm={handleSubmit}
          onSubmitProduct={onSubmitAddProduct}
          register={register}
          categoriesProducts={categoriesProducts}
          handleChangeCategory={handleChangeCategory}
          handleChangeSizes={handleChangeSizes}
          setSpekProduct={setSpekProduct}
          sizesProducts={sizesProducts}
          spekProduct={spekProduct}
          uploadImage={uploadImage}
          progress={progress}
          type="add"
          errors={errors}
          errorCate={errorCate}
        />
      </div>
    </DefaultLayout>
  );
};

export default AddNewProduct;
