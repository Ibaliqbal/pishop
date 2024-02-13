import DefaultLayout from "@/components/Layout/DefaultLayout";
import { db } from "@/firebaseConfig";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ToRupiah } from "@/utils/toRupiah";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { BsArrowLeft, BsShop, BsCart4 } from "react-icons/bs";
import { useGetProducts } from "@/hooks/useGetProducts";
import UserProfileDeafult from "@/assets/userProfile.svg";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { GetDataType } from "@/types/data.type";
import { useGetUserById } from "@/hooks/useGetUserById";
import { useAddToCart } from "@/context/cart.context";
import { v4 as uuidv4 } from "uuid";
import { Products } from "@/types/products.type";

const report = [
  "Kategori produk salah/tidak sesuai",
  "Menjual obat keras dan alat kesehatan medis",
  "Menjual senjata api dan amunisi",
  "Menjual hewan?tumbuhan yang dilindungi",
  "Produk mengandung unsur pronografi dan kurang pantas",
  "Produk melanggar ketentuan penjualan",
  "Produk melanggar hak cipta atau distribusi",
  "Produk mencuri foto, judul, atau deskripsi produk lain tannpa izin",
  "Detail produk mengindikasi upaya penipuan",
];

const DetailProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<DocumentData | undefined | Products>(
    undefined
  );
  const [imageProduct, setImageProduct] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [checkReport, setCheckReport] = useState<string[]>([]);
  const [seller, setSeller] = useState<GetDataType>();
  const products = useGetProducts();
  const navigate = useNavigate();
  const { data, id: idUser } = useGetUserById();
  const addToCart = useAddToCart();
  useEffect(() => {
    const unsuscribe = onSnapshot(
      doc(db, "allproducts", id ?? ""),
      async (snapshot) => {
        setProduct({ ...snapshot.data(), id: snapshot.id });
        setImageProduct(snapshot.data()?.product_image[0]);
        const q = query(
          collection(db, "users"),
          where("username", "==", snapshot.data()?.name_seller)
        );
        const snapshotSeller = await getDocs(q);
        let sellerData = {} as any;
        snapshotSeller.forEach((doc) => {
          sellerData = { ...doc.data(), id: doc.id };
        });
        setSeller(sellerData);
      }
    );
    //   try {
    //     setLoading(true);
    //     const docRef = doc(db, "allproducts", id ?? "");
    //     const document = await getDoc(docRef);
    //     const q = query(
    //       collection(db, "users"),
    //       where("username", "==", document.data()?.name_seller)
    //     );
    //     const snapshot = await getDocs(q);
    //     snapshot.forEach((doc) => {
    //       setSellerId(doc.id);
    //     });
    //     setImageProduct(document.data()?.product_image);
    //     setProduct(document.data());
    //   } catch (error) {
    //     console.log(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // id && getProduct();
    return () => unsuscribe();
  }, [id]);

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

  const handleCheck = (list: string) => {
    const checkList = checkReport.find((item) => item === list);
    if (checkList) {
      const filters = checkReport.filter((item) => item !== checkList);
      setCheckReport([...filters]);
    } else {
      setCheckReport((prev) => [...prev, list]);
    }
  };

  const handleAddReport = async () => {
    if (checkReport.length <= 0)
      return toast.error("Choose at least one reason");
    await addDoc(collection(db, "reports"), {
      idProducts: id,
      report: checkReport,
    });
    toast.success("Berhasil melaporkan");
    setCheckReport([]);
  };

  const handleFollowShop = async () => {
    if (data?.email === seller?.email)
      return toast.error("You can't follow yourself");
    await updateDoc(doc(db, "users", idUser ?? ""), {
      followShop: [...data?.followShop, product?.name_seller],
    });
    const updateFoolowers = seller?.followers ? seller.followers + 1 : 0 + 1;
    await updateDoc(doc(db, "users", seller?.id ?? ""), {
      followers: updateFoolowers,
    });
  };

  const handleUnFollowShop = async () => {
    await updateDoc(doc(db, "users", idUser ?? ""), {
      followShop: data?.followShop.filter(
        (shop: string) => shop !== product?.name_seller
      ),
    });
    if (seller?.followers) {
      const updateFoolowers = seller.followers > 0 ? seller.followers - 1 : 0;
      console.log(updateFoolowers);
      console.log(seller?.id);
      await updateDoc(doc(db, "users", seller?.id ?? ""), {
        followers: updateFoolowers,
      });
    }
  };

  const handleAddToCart = async () => {
    const idDoc = uuidv4();
    const queryUser = doc(db, "users", idUser ?? "");
    const queryNameProduct = query(
      collection(queryUser, "cart"),
      where("name_product", "==", product?.name_product)
    );
    const snapshot = await getDocs(queryNameProduct);
    const addCart = {
      id_product: product?.id,
      name_product: product?.name_product,
      thumbnail: product?.product_image[0],
      price: product?.price_product,
      name_seller: product?.name_seller,
      quantity: qty,
      checkout_product: false,
    };
    if (snapshot.docs[0]?.exists()) {
      await updateDoc(doc(queryUser, "cart", snapshot.docs[0].id), {
        quantity: snapshot.docs[0].data().quantity + qty,
      });
      addToCart(addCart);
    } else {
      await setDoc(doc(queryUser, "cart", idDoc), {
        ...addCart,
      });
      addToCart(addCart);
    }
    toast.success("berhasil di masukkan ke cart");
  };

  return (
    <DefaultLayout>
      <button onClick={() => history.back()} className="text-white text-2xl">
        <BsArrowLeft />
      </button>
      {product ? (
        product ? (
          <section className="text-white w-full px-2 pt-4 pb-20 md:pb-8">
            <div className="grid lg:grid-cols-3 place-items-center lg:place-items-stretch gap-3">
              <div className="lg:col-span-1 w-full flex flex-col items-center gap-2 p-3">
                <motion.img
                  variants={variant}
                  initial="initial"
                  animate="enter"
                  transition={{ duration: 1, type: "spring" }}
                  key={imageProduct}
                  src={imageProduct}
                  alt=""
                  className="lg:aspect-[1/1.5] md:aspect-[1/1] w-full aspect-[1/1.2] object-cover"
                />
                <div className="flex max-w-full overflow-y-auto kum-img gap-1">
                  {product?.product_image.map((img: string, i: number) => (
                    <img
                      src={img}
                      alt="Product"
                      key={i}
                      className="w-[150px] h-[150px]"
                      onMouseOver={() => setImageProduct(img)}
                      onClick={() => setImageProduct(img)}
                    />
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2 w-full p-2">
                <h1 className="md:text-3xl">{product?.name_product}</h1>
                <div className="w-full flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <p>{product?.comments_product.length} Ratings</p> |
                    <p>
                      {product?.soldout_product < 1000
                        ? product?.soldout_product
                        : `${product?.soldout_product / 1000}K`}{" "}
                      Sold
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <p className="text-lg text-blue-600 cursor-pointer hover:text-blue-800">
                        Report
                      </p>
                    </DialogTrigger>
                    <DialogContent className="max-w-xs md:max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Laporkan</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>Select Reason</DialogDescription>
                      <div className=" flex flex-col gap-3">
                        {report.map((list, i) => {
                          return (
                            <div
                              className="flex items-center space-x-2"
                              key={i}
                            >
                              <Checkbox
                                id="terms"
                                checked={checkReport.includes(list)}
                                onCheckedChange={() => handleCheck(list)}
                              />
                              <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {list}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                      <DialogFooter>
                        <DialogClose>
                          <Button
                            type="button"
                            className="bg-blue-700 hover:bg-blue-800 focus:bg-blue-800"
                            onClick={handleAddReport}
                          >
                            Submit
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <h2 className="md:text-6xl my-8">
                  {ToRupiah(product?.price_product)}
                </h2>
                {/* <p>{product?.timestamp}</p> */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex items-center">
                    <Button
                      className="font-bold bg-white/10"
                      variant="ghost"
                      size="sm"
                      disabled={qty <= 0}
                      onClick={() => setQty((prev) => prev - 1)}
                    >
                      -
                    </Button>
                    <p className="px-6">{qty}</p>
                    <Button
                      className="font=bold bg-white/10"
                      variant="ghost"
                      size="sm"
                      onClick={() => setQty((prev) => prev + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <p>{product?.stock_product} pieces availabel</p>
                </div>
                {product?.size_product.length > 0 ? (
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                    <h2>Size : </h2>
                    {product?.size_product.map((size: string, i: number) => (
                      <div key={i} className="flex flex-wrap gap-4">
                        {" "}
                        <p
                          key={i}
                          className="px-4 py-2 border-2 border-white rounded-md"
                        >
                          {size}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className=" flex items-center gap-3 my-4">
                  <Button
                    size="lg"
                    className="bg-slate-700/30 hover:bg-slate-800/70"
                    onClick={() => handleAddToCart()}
                  >
                    Add to cart <BsCart4 className="ml-3" />
                  </Button>
                  <Button size="lg" className="bg-blue-700 hover:bg-blue-800">
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
            <div className="my-8 w-full p-4 flex flex-col md:flex-row items-center gap-4 shadow-lg shadow-gray-500">
              <div className="flex gap-2 md:gap-8 items-center">
                <Avatar className="md:w-[100px] w-[80px] h-[80px] md:h-[100px]">
                  <AvatarImage src={product?.image_seller} />
                </Avatar>
                <div className="flex flex-col md:gap-10 gap-5 p-2 md:items-center">
                  <h1 className="text-xs md:text-lg">{product?.name_seller}</h1>
                  <div className="flex items-center gap-3">
                    {data?.followShop.includes(product.name_seller) ? (
                      <Button
                        variant="ghost"
                        className="bg-slate-900"
                        onClick={() => handleUnFollowShop()}
                      >
                        UnFollow Shop
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        className="bg-slate-900"
                        onClick={() => handleFollowShop()}
                      >
                        + Follow Shop
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="bg-slate-900"
                      onClick={() => navigate(`/shop/${seller?.id}`)}
                    >
                      View Shop
                      <BsShop className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex md:flex-col items-center gap-10">
                <p>Follower: {seller?.followers}</p>
                <p>
                  Products:{" "}
                  {
                    products.filter(
                      (items) => items.name_seller === product?.name_seller
                    ).length
                  }
                </p>
              </div>
            </div>
            <div className="w-full p-4 bg-slate-200 text-black rounded-md flex flex-col gap-6">
              <div>
                <h1 className="md:text-xl text-sm underline-offset-4 underline">
                  Product Specification
                </h1>
                {product?.spek_product.map(
                  (spek: { nameSpek: string; valSpek: string }, i: number) => {
                    return (
                      <div
                        key={i}
                        className="flex gap-6 mt-4 text-xs md:text-lg"
                      >
                        <p>{spek.nameSpek}</p> : <p>{spek.valSpek}</p>
                      </div>
                    );
                  }
                )}
              </div>
              <div>
                <h1 className="md:text-xl text-sm underline-offset-4 underline">
                  Product Description
                </h1>
                <p className="mt-6 text-xs md:text-lg">
                  {product?.ket_product}
                </p>
              </div>
            </div>
            <div className="w-full p-4 mt-6">
              <h2 className="md:text-xl text-sm">Product Ratings</h2>
              <div className="mt-4 w-full">
                <div className="flex p-3 border-b-4 gap-4 border-b-slate-600 w-full">
                  <div className="grow-0 grid place-items-center">
                    <Avatar className="bg-white">
                      <AvatarImage src={UserProfileDeafult} alt="Profile" />
                    </Avatar>
                  </div>
                  <div className="grow px-4 pt-4">
                    <h2>Username</h2>
                    <p className="text-sm">2024-01-17</p>
                    <p>Barangnya Bagus banget</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null
      ) : (
        <div className="loader"></div>
      )}
    </DefaultLayout>
  );
};

export default DetailProduct;
