import React, { SetStateAction, useRef } from "react";
import { Button } from "../ui/button";
import { AiOutlineReload } from "react-icons/ai";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { motion } from "framer-motion";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { toast } from "sonner";
import Select, { MultiValue } from "react-select";
import { DocumentData } from "firebase/firestore";
import makeAnimated from "react-select/animated";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { TProductSchema } from "@/types/products.type";

type FormProductProps = {
  data: DocumentData | undefined | null;
  spekProduct: { nameSpek: string; valSpek: string }[];
  setSpekProduct: React.Dispatch<
    SetStateAction<{ nameSpek: string; valSpek: string }[]>
  >;
  handleChangeCategory: (option: MultiValue<unknown>) => void;
  handleChangeSizes: (option: MultiValue<unknown>) => void;
  categoriesProducts: any;
  sizesProducts: any;
  register: UseFormRegister<TProductSchema>;
  handleSubmitForm: UseFormHandleSubmit<TProductSchema, TProductSchema>;
  onSubmitProduct: (data: TProductSchema) => Promise<void>;
  uploadImage: (file: File, sellerName: string) => void;
  progress: number;
  isSubmitting: boolean;
  type: "add" | "update";
  errors: FieldErrors<TProductSchema>;
  errorCate: string;
};

type Option = {
  value: string;
  label: string;
};
export const category: Option[] = [
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
  { value: "38", label: "38" },
  { value: "39", label: "39" },
  { value: "40", label: "40" },
  { value: "41", label: "41" },
  { value: "42", label: "42" },
  { value: "43", label: "43" },
  { value: "44", label: "44" },
];

const FormProduct = ({
  data,
  handleChangeCategory,
  handleChangeSizes,
  categoriesProducts,
  setSpekProduct,
  sizesProducts,
  spekProduct,
  register,
  handleSubmitForm,
  onSubmitProduct,
  uploadImage,
  progress,
  isSubmitting,
  type,
  errors,
  errorCate,
}: FormProductProps) => {
  const nameSpekRef = useRef<HTMLInputElement>(null);
  const valSpekRef = useRef<HTMLInputElement>(null);
  const animatedComp = makeAnimated();

  return (
    <form
      className="flex flex-col gap-6 w-full min-h-[80dvh] mt-3 p-4"
      onSubmit={handleSubmitForm(onSubmitProduct)}
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
        <Label htmlFor="name_product">Nama Product</Label>
        <Input
          id="name_product"
          placeholder="Masukkan nama product nya"
          className="text-black"
          {...register("name_product")}
        />
        {errors.name_product && (
          <p className="text-red-500">{errors.name_product.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="price">Harga Product</Label>
        <Input
          id="price"
          placeholder="Masukkan harga product nya"
          className="text-black"
          type="number"
          {...register("price_product", { valueAsNumber: true })}
        />
        {errors.price_product && (
          <p className="text-red-500">{errors.price_product.message}</p>
        )}
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
          defaultValue={categoriesProducts}
        />
        {errorCate && <p className="text-red-500">{errorCate}</p>}
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
          defaultValue={sizesProducts}
        />
      </div>
      <div>
        <Label htmlFor="stock_product">Stock Product</Label>
        <Input
          type="number"
          id="stock_product"
          placeholder="Masukkan jumlah product anda"
          className="text-black"
          {...register("stock_product", { valueAsNumber: true })}
        />
        {errors.stock_product && (
          <p className="text-red-500">{errors.stock_product?.message}</p>
        )}
      </div>
      <div className="bg-gray-800 p-3 w-full">
        <h3>Product Specifications</h3>
        <div className="mt-3 flex flex-col md:flex-row gap-4">
          <div className="grow">
            <Label htmlFor="nameSpek">Name</Label>
            <Input
              type="text"
              id="nameSpek"
              placeholder="Masukkan jumlah product anda"
              ref={nameSpekRef}
              className="text-black"
            />
          </div>
          <div className="grow">
            <Label htmlFor="valSpek">Value</Label>
            <Input
              type="text"
              id="valSpek"
              ref={valSpekRef}
              placeholder="Masukkan jumlah product anda"
              className="text-black"
            />
          </div>
          <Button
            size="lg"
            type="button"
            className="self-end w-[20px] grow-0 justify-self-end font-bold text-xl bg-sky-500 hover:bg-sky-800 focus:bg-sky-800 "
            onClick={() =>
              setSpekProduct((prev) => [
                ...prev,
                {
                  nameSpek: nameSpekRef.current?.value ?? "",
                  valSpek: valSpekRef.current?.value ?? "",
                },
              ])
            }
          >
            +
          </Button>
        </div>
        <div className="flex flex-col gap-4 mt-3">
          {spekProduct.map((spek, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="grow">
                <Label>Name</Label>
                <Input readOnly value={spek.nameSpek} className="text-black" />
              </div>
              <div className="grow">
                <Label>Value</Label>
                <Input readOnly value={spek.valSpek} className="text-black" />
              </div>
              <Button
                size="lg"
                type="button"
                className="self-end w-[20px] grow-0 justify-self-end font-bold text-xl bg-red-500 hover:bg-red-800 focus:bg-red-800 "
                onClick={() =>
                  setSpekProduct(spekProduct.filter((_, index) => index !== i))
                }
              >
                X
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="ket_product">Keterangan Product</Label>
        <Textarea
          id="ket_product"
          placeholder="Masukkan keterangan product nya"
          className="text-black"
          {...register("ket_product")}
        />
        {errors.ket_product && (
          <p className="text-red-500">{errors.ket_product.message}</p>
        )}
      </div>
      {isSubmitting || !(progress !== null && progress < 100) ? (
        <Button disabled className="text-white bg-sky-800 self-end">
          <AiOutlineReload className="mr-2 w-4 h-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button
          type="submit"
          className="self-end bg-sky-500 hover:bg-sky-800 focus:bg-sky-800"
        >
          {type === "update" ? "Update" : "Tambah"}
        </Button>
      )}
    </form>
  );
};

export default FormProduct;
