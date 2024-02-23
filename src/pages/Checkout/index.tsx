import Title from "@/components/Title";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetUserById } from "@/hooks/useGetUserById";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToRupiah } from "@/utils/toRupiah";
import { CartProduct } from "@/types/cart.type";
import { AiOutlineReload } from "react-icons/ai";
import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProfit } from "@/hooks/useProfit";

const schema = z.object({
  nameCus: z.string(),
  emailCus: z.string().email(),
  addressCus: z.string(),
});

type CheckoutProps = {
  products: (CartProduct | DocumentData)[];
  idCartProducts: string[];
};

const Checkout = ({ products, idCartProducts }: CheckoutProps) => {
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [handleAddress, setHandleAddress] = useState<boolean>(false);
  const [lock, setLock] = useState<boolean>(false);
  const { data, id } = useGetUserById();
  const [loading, setLoading] = useState<boolean>(false);
  const queryUser = doc(db, "users", id ?? "");
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState<z.infer<typeof schema>[]>([]);
  const { increaseProfit } = useProfit();

  const { register, handleSubmit, setValue } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const totalPrice = useMemo(() => {
    return products
      .filter((product) => product.checkout_product)
      .reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
  }, [products]);

  const onSubmit = (data: z.infer<typeof schema>) => {
    setLock(true);
    setUserDetail([data]);
  };

  const step_checkout = [
    {
      name: "User Info",
      Component: (
        <div className="w-9/12 p-3 grid text-white">
          <form className="grid gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
            <Title text="Data customer" size="text-2xl" />
            <div>
              <Label htmlFor="nameCus">Name</Label>
              <Input
                id="nameCus"
                type="text"
                placeholder="John Doe"
                {...register("nameCus")}
                className="text-black"
                readOnly={lock}
              />
            </div>
            <div>
              <Label htmlFor="emailCus">Email</Label>
              <Input
                id="emailCus"
                type="email"
                placeholder="expmale@gmail.com"
                {...register("emailCus")}
                className="text-black"
                readOnly={lock}
              />
            </div>
            <div>
              <Label htmlFor="addressCus">Alamat Customer</Label>
              <Input
                id="    addressCus"
                placeholder="Input your address"
                {...register("addressCus")}
                className="text-black"
                readOnly={handleAddress || lock}
              />
              <div className="mt-4 flex items-center gap-3">
                <Checkbox
                  id="address"
                  checked={handleAddress}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-white"
                  onCheckedChange={() => {
                    setHandleAddress(!handleAddress);
                    !handleAddress
                      ? setValue("addressCus", data?.address)
                      : setValue("addressCus", data?.address);
                  }}
                  disabled={lock}
                />
                <Label htmlFor="address">
                  Gunakan data yang sudah digunakan di profile ?
                </Label>
              </div>
            </div>
            {!lock && (
              <Button
                type="submit"
                variant="ghost"
                className="bg-slate-700 text-white"
              >
                Simpan
              </Button>
            )}
          </form>
          {lock && (
            <Button
              type="button"
              variant="ghost"
              className="bg-slate-700 text-white mt-4"
              onClick={() => setLock(false)}
            >
              Batal
            </Button>
          )}
        </div>
      ),
    },
    {
      name: "Checkout",
      Component: (
        <main className="text-white w-9/12 p-3">
          <div className="flex flex-col w-full">
            <section className="w-full bg-red-500 grid gap-3">
              {products.length > 0 ? (
                products.map((product) => (
                  <article
                    className="flex md:items-center md:flex-row flex-col gap-8 w-full p-3"
                    key={product.id}
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.name_product}
                      className="w-[150px] h-[150px] md:grow-0"
                      loading="lazy"
                    />
                    <div className="flex flex-col h-full justify-around md:grow">
                      <h2 className="text-lg font-bold">
                        {product.name_product}
                      </h2>
                      <p className="text-sm">{ToRupiah(product.price)}</p>
                    </div>
                    <p className="md:grow-0">Item : {product.quantity}</p>
                  </article>
                ))
              ) : (
                <p>Pilih product terlebih dahulu</p>
              )}
            </section>
            <p className="self-end font-bold mt-4 text-xl">
              Total Price : {totalPrice ? ToRupiah(totalPrice) : ToRupiah(0)}
            </p>
          </div>
        </main>
      ),
    },
  ];

  const handlePayment = async () => {
    const docId = uuidv4();
    const queryAdmin = query(
      collection(db, "users"),
      where("role", "==", "admin")
    );
    const docAdmin = await getDocs(queryAdmin);
    // if (data?.e_wallet < totalPrice) {
    //   return toast.error("Uang kamu kurang");
    // } else {
    // }
    try {
      setLoading(true);
      // untuk mentimpan data order ke setiap seller dari product yang di checkout oleh user
      products.forEach(async (product) => {
        // melakukan pencarian seller berdasarkan name_seller
        const q = query(
          collection(db, "users"),
          where("username", "==", product.name_seller)
        );
        // Mengambil document dari user yang sudah saya query
        const queryUserP = await getDocs(q);
        const allProductRef = await getDoc(
          doc(db, "allproducts", product.id_product)
        );
        // Melakukan pengurangan stock barang pada collection seller
        if (allProductRef.exists() && queryUserP.docs[0].exists()) {
          // Melakukan pengurangan stock barang pada collection allproducts
          await updateDoc(
            doc(queryUserP.docs[0].ref, "products", product.id_product),
            {
              stock_product:
                allProductRef.data().stock_product - product.quantity,
              soldout_product:
                allProductRef.data().soldout_product + product.quantity,
            }
          );
          await updateDoc(doc(db, "allproducts", product.id_product), {
            stock_product:
              allProductRef.data().stock_product - product.quantity,
            soldout_product:
              allProductRef.data().soldout_product + product.quantity,
          });
        }
        // Melakukakn perhitungan profit yang diambil dari 4% total harga product yang di checkout
        await setDoc(doc(docAdmin.docs[0].ref, "profit", uuidv4()), {
          profitAt: serverTimestamp(),
          profitUpdate: Math.round(
            (product.quantity * product.price * 4) / 100
          ),
        });
        // Melakukakn perhitungan profit dan juga melakukan pada seller dan sudah di kurang 4%
        increaseProfit(queryUserP, product);
        // Melakukan sebuah pembuatan collection orders pada seller
        await setDoc(doc(queryUserP.docs[0].ref, "orders", docId), {
          orderId: docId,
          id_product: product.id_product,
          id_user: id,
          name_product: product.name_product,
          qty: product.quantity,
          thumbnail: product.thumbnail,
          detailCus: { ...userDetail[0] },
          orderAt: serverTimestamp(),
          totalPrice: product.price * product.quantity,
          status: "pending",
          size: product.size,
        });
      });
      // Melakukan pembuatan collection order_products pada data customer
      await setDoc(doc(queryUser, "order_products", docId), {
        orderId: docId,
        products: [
          ...products.map(({ id, checkout_product, ...product }) => {
            return {
              ...product,
              status: "pending",
            };
          }),
        ],
        detail_customer: { ...userDetail[0] },
        orderAt: serverTimestamp(),
        totalPrice,
      });
      await updateDoc(doc(db, "users", id ?? ""), {
        e_wallet: data?.e_wallet - totalPrice,
      });
      // Menghilang product pada cart yang sudah di checkout
      idCartProducts.forEach(async (id) => {
        await deleteDoc(doc(queryUser, "cart", id));
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setCurrentStep(1);
      navigate(`/order/${docId}`);
      toast.success("Order has been created");
    }
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => {
      if (prevStep === step_checkout.length) {
        setIsComplete(true);
        return prevStep + 1;
      } else {
        return prevStep + 1;
      }
    });
  };
  const ActiveComp =
    currentStep <= step_checkout.length ? (
      step_checkout[currentStep - 1].Component
    ) : (
      <></>
    );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-white h-full" disabled={products.length === 0}>
          Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-7xl">
        <DialogHeader>
          <DialogTitle>
            <Title
              size="text-3xl text-center text-white mb-14 mt-10"
              text="Checkout"
            />
          </DialogTitle>
          <div className="flex justify-evenly text-white">
            {step_checkout.map((step, i) => (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: i * 0.2, tu: "spring" }}
                className="flex items-center flex-col gap-6"
                key={i}
              >
                <div
                  className={`w-10 h-10 rounded-full transition-all duration-300 ease-linear border-2 border-white ${
                    currentStep >= i + 1 || isComplete
                      ? "bg-green-500 border-none"
                      : ""
                  } ${
                    currentStep === i + 1 ? "bg-sky-600" : ""
                  }  flex justify-center items-center mr-4`}
                >
                  <p>{i + 1}</p>
                </div>
                <h1>{step.name}</h1>
              </motion.div>
            ))}
          </div>
        </DialogHeader>
        <section className="p-4 md:max-h-72 max-h-64 form-checkout overflow-x-auto">
          <section className="flex flex-col p-4 gap-4 items-center mt-6">
            {ActiveComp}
          </section>
        </section>
        <DialogFooter>
          <div className="flex items-center gap-4 self-end">
            {!(currentStep > step_checkout.length) &&
              currentStep !== 1 &&
              !isComplete && (
                <Button
                  onClick={() => setCurrentStep((prevStep) => prevStep - 1)}
                  className="text-white bg-slate-700"
                  variant="ghost"
                  type="button"
                  disabled={loading}
                >
                  Prev
                </Button>
              )}
            {!isComplete && currentStep >= step_checkout.length ? (
              <Button
                className="text-white bg-slate-700"
                variant="ghost"
                onClick={handlePayment}
                type="button"
              >
                {loading ? (
                  <AiOutlineReload className="animate-spin text-xl" />
                ) : (
                  "Checkout"
                )}
              </Button>
            ) : (
              <Button
                className="text-white bg-slate-700"
                variant="ghost"
                onClick={handleNext}
                type="button"
                disabled={userDetail.length === 0 ? true : false}
              >
                Next
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Checkout;
