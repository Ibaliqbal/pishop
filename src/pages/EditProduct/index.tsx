import DefaultLayout from "@/components/Layout/DefaultLayout";
import Title from "@/components/Title";
import { IoMdArrowRoundBack, IoIosCloseCircle } from "react-icons/io";
import { MultiValue } from "react-select";
import { MdCameraAlt } from "react-icons/md";
import { toast } from "sonner";
import useStorageProducts from "@/hooks/useStorageProducts";
import { useGetUserById } from "@/hooks/useGetUserById";
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import FormProduct from "@/components/Fragments/FormProduct";
import { useForm } from "react-hook-form";
import { TProductSchema, productSchema } from "@/types/products.type";
import { zodResolver } from "@hookform/resolvers/zod";

type Option = {
  value: string;
  label: string;
};

const EditProduct = () => {
  const { data } = useGetUserById();
  const { id: IdProduct } = useParams();
  const [loadProduct, setLoadProduct] = useState<boolean>(false);
  const {
    imagesProduct,
    handleDelete,
    setImagesProduct,
    uploadImage,
    progress,
  } = useStorageProducts();
  const [categoriesProducts, setCategoriesProducts] = useState<any>([]);
  const [sellerName, setSellerName] = useState<string>("");
  const [sizesProducts, setSizesProducts] = useState<any>([]);
  const [errorCate, setErrorCate] = useState<string>("");
  const [spekProduct, setSpekProduct] = useState<
    {
      nameSpek: string;
      valSpek: string;
    }[]
  >([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<TProductSchema>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoadProduct(true);
        const product = await getDoc(doc(db, "allproducts", IdProduct ?? ""));
        setImagesProduct(product.data()?.product_image);
        setValue("name_product", product.data()?.name_product);
        setValue("ket_product", product.data()?.ket_product);
        setValue("price_product", product.data()?.price_product);
        setValue("stock_product", product.data()?.stock_product);
        setCategoriesProducts(
          product.data()?.category_product.map((cate: string) => {
            return {
              value: cate,
              label: cate,
            };
          })
        );
        setSizesProducts(
          product.data()?.size_product.map((size: string) => {
            return {
              value: size,
              label: size,
            };
          })
        );
        setSpekProduct(product.data()?.spek_product);
        setSellerName(product.data()?.name_seller);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadProduct(false);
      }
    };
    IdProduct && getProduct();
  }, [IdProduct]);

  const handleChangeCategory = (option: MultiValue<unknown>) => {
    setCategoriesProducts((prev: MultiValue<unknown>) => [...prev, option]);
  };
  const handleChangeSizes = (option: MultiValue<unknown>) => {
    setSizesProducts((prev: MultiValue<unknown>) => [...prev, option]);
  };

  const onSubmitUpdateProduct = async (dataForm: TProductSchema) => {
    try {
      if (categoriesProducts.length > 0) {
        const sellerRef = query(
          collection(db, "users"),
          where("username", "==", sellerName)
        );
        const sellerSnap = await getDocs(sellerRef);
        await updateDoc(doc(db, "allproducts", IdProduct ?? ""), {
          ...dataForm,
          product_image: imagesProduct,
          price_product: dataForm.price_product,
          category_product: categoriesProducts.map(
            (data: Option) => data.value
          ),
          size_product:
            sizesProducts.length > 0
              ? sizesProducts.map((data: Option) => data.value)
              : [],
          image_seller: data?.image,
          spek_product: spekProduct,
        });

        await updateDoc(
          doc(sellerSnap.docs[0].ref, "products", IdProduct ?? ""),
          {
            product_image: imagesProduct,
            ...dataForm,
            price_product: dataForm.price_product,
            category_product: categoriesProducts.map(
              (data: Option) => data.value
            ),
            size_product:
              sizesProducts.length > 0
                ? sizesProducts.map((data: Option) => data.value)
                : [],
            image_seller: data?.image,
            spek_product: spekProduct,
          }
        );
        toast.success("Product updated successfully");
        navigate("/profile");
      } else {
        setErrorCate("Choose option at least one option");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return loadProduct ? (
    <div className="loader"></div>
  ) : (
    <DefaultLayout>
      <div className="text-white px-4 pb-4 pt-8 w-full">
        <button onClick={() => history.back()} className="text-white text-2xl">
          <IoMdArrowRoundBack />
        </button>
        <Title size="text-2xl" className="text-center" text="Edit Product" />
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
          data={data}
          isSubmitting={isSubmitting}
          handleSubmitForm={handleSubmit}
          onSubmitProduct={onSubmitUpdateProduct}
          register={register}
          categoriesProducts={categoriesProducts}
          handleChangeCategory={handleChangeCategory}
          handleChangeSizes={handleChangeSizes}
          setSpekProduct={setSpekProduct}
          sizesProducts={sizesProducts}
          spekProduct={spekProduct}
          uploadImage={uploadImage}
          progress={progress}
          type="update"
          errors={errors}
          errorCate={errorCate}
        />
      </div>
    </DefaultLayout>
  );
};

export default EditProduct;
