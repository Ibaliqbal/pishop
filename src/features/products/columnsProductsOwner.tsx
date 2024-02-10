import { Products } from "@/types/products.type";
import { ColumnDef } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BsThreeDots, BsTrash, BsEyeFill } from "react-icons/bs";
import { toast } from "sonner";
import { ToRupiah } from "@/utils/toRupiah";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { motion } from "framer-motion";
import { TbEditCircle, TbReload } from "react-icons/tb";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { IoReload } from "react-icons/io5";
import { db } from "@/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const columnsProductsOwner: ColumnDef<Products>[] = [
  {
    id: "S.No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
    header: "No",
  },
  {
    header: "Product Thumbnail",
    accessorKey: "product_image",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <img
          src={product.product_image[0]}
          alt={product.name_product}
          className="w-[100px] h-[100px] object-cover"
        />
      );
    },
  },
  {
    header: "Name Product",
    accessorKey: "name_product",
  },
  {
    header: "Price",
    accessorKey: "price_product",
    cell: ({ row }) => {
      const product = row.original;
      return <div>{ToRupiah(product.price_product)}</div>;
    },
  },
  {
    header: "Stock",
    accessorKey: "stock_product",
  },
  {
    header: "Soldout",
    accessorKey: "soldout_product",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      const [image, setImage] = useState<string>(product.product_image[0]);
      const [loading, setLoading] = useState<boolean>(false);
      const navigate = useNavigate();
      const variant = {
        initial: {
          opacity: 0,
          scale: 0.3,
          originX: 0.5,
          originY: 1,
        },
        enter: {
          opacity: 1,
          scale: 1,
          originX: 0.5,
          originY: 1,
        },
      };

      async function handleDeleteProduct(id: string, seller: string) {
        try {
          setLoading(true);
          // Ambil doc user dengan nama penjual tersebut
          const sellerRef = query(
            collection(db, "users"),
            where("username", "==", seller)
          );
          const sellerSnap = await getDocs(sellerRef);

          // // Hapus doc hasil query di subcollection products
          await deleteDoc(doc(sellerSnap.docs[0].ref, "products", id));

          // // Hapus doc asli di allproducts
          await deleteDoc(doc(db, "allproducts", id));
          toast.success("Product deleted successfully");
        } catch (error) {
          console.log(error);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      }
      return loading ? (
        <TbReload className="text-2xl animate-spin" />
      ) : (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <BsThreeDots className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleDeleteProduct(product.id, product.name_seller);
                    }
                  });
                }}
                className="text-red-600 text-md flex items-center gap-3"
              >
                <BsTrash /> Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-md flex items-center gap-3"
                onClick={() => navigate(`/edit_product/${product.id}`)}
              >
                <TbEditCircle /> Edit
              </DropdownMenuItem>
              <DialogTrigger asChild>
                <DropdownMenuItem className="text-yellow-600 text-md flex items-center gap-3">
                  <BsEyeFill /> View
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="max-w-xs md:max-w-5xl">
            <DialogHeader>
              <DialogTitle>{product.name_product}</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-3 place-items-center md:place-items-start items-center space-x-2">
              <div className="md:col-span-1 w-full flex flex-col items-center gap-2 p-3">
                <motion.img
                  variants={variant}
                  initial="initial"
                  animate="enter"
                  transition={{ duration: 1, type: "spring" }}
                  key={image}
                  src={image}
                  alt=""
                  className="md:aspect-[1/1.2] aspect-[1/1.2] object-cover"
                />
                <div className="flex max-w-full overflow-y-auto kum-img gap-1">
                  {product?.product_image.map((img: string, i: number) => (
                    <img
                      src={img}
                      alt=""
                      key={i}
                      className="w-[150px] h-[150px]"
                      onMouseOver={() => setImage(img)}
                    />
                  ))}
                </div>
              </div>
              <DialogDescription className="md:col-span-2 p-3">
                <div>
                  <h1 className="text-lg underline underline-offset-4">
                    Description Product
                  </h1>
                  <p className="mt-3">{product.ket_product}</p>
                </div>
                <p className="mt-3 text-lg">
                  {ToRupiah(product.price_product)}
                </p>
              </DialogDescription>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
