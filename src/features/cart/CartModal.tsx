import { useEffect, useMemo, useState } from "react";
import { HiShoppingCart, HiTrash } from "react-icons/hi";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartProduct } from "@/types/cart.type";
import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useGetUserById } from "@/hooks/useGetUserById";
import { ToRupiah } from "@/utils/toRupiah";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import Checkout from "@/pages/Checkout";

const CartModal = () => {
  const [cartProduct, setCartProduct] = useState<
    (CartProduct | DocumentData)[]
  >([]);
  const { id } = useGetUserById();
  const queryUser = doc(db, "users", id ?? "");
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(queryUser, "cart"),
      (snapshot) => {
        let arrCart: any[] = [];
        snapshot.forEach((item) => {
          const data = { ...item.data(), id: item.id };
          arrCart.push(data);
        });
        setCartProduct(arrCart);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleIncrement = async (id: string) => {
    const findProduct = cartProduct.find((p) => p.id === id);
    if (findProduct) {
      await updateDoc(doc(queryUser, "cart", id), {
        quantity: findProduct.quantity + 1,
      });
    }
  };

  const handleDecrement = async (id: string) => {
    const findProduct = cartProduct.find((p) => p.id === id);
    if (findProduct) {
      if (findProduct.quantity === 1) {
        await deleteDoc(doc(queryUser, "cart", id));
      } else {
        await updateDoc(doc(queryUser, "cart", id), {
          quantity: findProduct.quantity - 1,
        });
      }
    }
  };

  const handleCheckoutProduct = async (id: string) => {
    const findProduct = cartProduct.find((p) => p.id === id);
    if (findProduct) {
      await updateDoc(doc(queryUser, "cart", id), {
        checkout_product: !findProduct.checkout_product,
      });
    }
  };

  const handleCheckoutAllProduct = (all: (CartProduct | DocumentData)[]) => {
    all.forEach(async (product) => {
      await updateDoc(doc(queryUser, "cart", product.id), {
        checkout_product: !product.checkout_product,
      });
    });
  };

  const totalAllProductsCheckout = useMemo(() => {
    return cartProduct
      .filter((product) => product.checkout_product)
      .reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
  }, [cartProduct]);

  return (
    <Sheet>
      <SheetTrigger>
        <div className="relative">
          <HiShoppingCart className="text-4xl cursor-pointer" />
          {cartProduct.length > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="w-6 h-6 bg-red-500 text-white absolute -top-2 rounded-full text-sm text-center -right-2"
            >
              {cartProduct.length <= 99 ? cartProduct.length : "99+"}
            </motion.p>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="flex flex-col md:max-w-3xl">
        <SheetHeader>
          <SheetTitle className="flex items-center text-4xl gap-4 h-full">
            Cart <HiShoppingCart />
          </SheetTitle>
        </SheetHeader>
        <div className="flex gap-2 items-center mt-4">
          <Label htmlFor="selectAll">Select All Product</Label>
          <Checkbox
            id="selectAll"
            checked={
              cartProduct.length > 0 &&
              cartProduct.length ===
                cartProduct.filter((product) => product.checkout_product).length
            }
            onCheckedChange={() => handleCheckoutAllProduct(cartProduct)}
            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
          />
        </div>
        <div className="grow flex flex-col gap-6 overflow-hidden mt-6">
          {cartProduct.map((product, index) => {
            return (
              <motion.article
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: index * 0.2, type: "spring" }}
                className={`md:flex grid grid-cols-2 items-center p-4 gap-3 ${
                  product.checkout_product && "bg-sky-300"
                }`}
                key={product.id}
              >
                <div className="md:grow-0 flex items-center gap-5">
                  <Checkbox
                    checked={product.checkout_product}
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
                    onCheckedChange={() => handleCheckoutProduct(product.id)}
                  />
                  <img
                    src={product.thumbnail}
                    alt="Product"
                    className="w-[100px] h-[100px] grow-0"
                    loading="lazy"
                  />
                </div>
                <section className="md:grow flex items-center h-full gap-3">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <h2 className="text-lg">{product.name_product}</h2>
                      <p className="text-sm">{ToRupiah(product.price)}</p>
                    </div>
                    <div className="flex items-center">
                      <Button
                        className="font-bold bg-primary text-white"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDecrement(product.id)}
                      >
                        -
                      </Button>
                      <p className="px-6">{product.quantity}</p>
                      <Button
                        className="font-bold bg-primary text-white"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleIncrement(product.id)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  {product.size && (
                    <div className="h-full justify-between items-center px-3 flex flex-col">
                      <h2 className="font-bold text-lg">Size</h2>
                      <p className="font-semibold">{product.size}</p>
                    </div>
                  )}
                </section>
                <div className="md:grow-0 col-span-2 flex justify-between md:mt-0 mt-3 gap-4 items-center">
                  <div className="flex md:flex-col justify-around items-center h-full mr-3 gap-4">
                    <h1>Total Price : </h1>
                    <p>{ToRupiah(product.price * product.quantity)}</p>
                  </div>
                  <HiTrash
                    className="text-red-500 cursor-pointer text-2xl"
                    onClick={async () => {
                      await deleteDoc(doc(queryUser, "cart", product.id));
                    }}
                  />
                </div>
              </motion.article>
            );
          })}
        </div>
        <SheetFooter>
          <div className="h-full flex flex-col gap-2">
            <h1>Total product to checkout : </h1>
            <p>{ToRupiah(totalAllProductsCheckout)}</p>
          </div>
          <Checkout
            products={cartProduct.filter((product) => product.checkout_product)}
            idCartProducts={cartProduct
              .filter((p) => p.checkout_product)
              .map((product) => product.id)}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartModal;
