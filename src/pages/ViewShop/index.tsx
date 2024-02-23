import DefaultLayout from "@/components/Layout/DefaultLayout";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { db } from "@/firebaseConfig";
import { useGetProductsOwner } from "@/hooks/useGetProductsOwner";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FiShoppingBag, FiStar, FiUsers } from "react-icons/fi";
import { BsArrowLeft } from "react-icons/bs";
import Title from "@/components/Title";
import { category } from "@/components/Fragments/FormProduct";
import Select, { MultiValue } from "react-select";
import makeAnimated from "react-select/animated";
import CardProduct from "@/components/CardProduct";
import { useGetUserById } from "@/hooks/useGetUserById";
import { GetDataType } from "@/types/data.type";
import { handleFollowShop, handleUnFollowShop } from "@/utils/followShop";
import { AuthContext } from "@/context/auth.context";
import { toast } from "sonner";

const ViewShop = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState<DocumentData | GetDataType>();
  const products = useGetProductsOwner(id ?? "");
  const animate = makeAnimated();
  const [filterProducts, setFilterProducts] = useState<MultiValue<unknown>>([]);
  const { data, id: idUser } = useGetUserById();
  const auth = useContext(AuthContext);
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", id ?? ""), (snapshot) => {
      setSeller({ ...snapshot.data(), id: snapshot.id });
    });
    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleFilter = (option: MultiValue<unknown>) => {
    console.log(option);
    setFilterProducts(option);
  };
  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.category_product.some((cate) =>
          filterProducts?.some((item: any) => item.value === cate)
        )
      ),
    [filterProducts, products]
  );
  return (
    <DefaultLayout>
      <button onClick={() => history.back()} className="text-white text-2xl">
        <BsArrowLeft />
      </button>
      {seller == undefined ? (
        <div className="loader"></div>
      ) : (
        <section className="p-4 text-white pb-24 lg:pb-4">
          <div className="mb-4 w-full p-6 gap-4 grid md:grid-cols-3 place-items-center md:place-items-start items-center border-b-2 border-b-gray-700">
            <div className="flex gap-4 p-2 items-center h-full md:col-span-1">
              <Avatar className="lg:w-[150px] lg:h-[150px] w-[100px] h-[100px]">
                <AvatarImage src={seller?.image} alt={seller?.username} />
              </Avatar>
              <div className="flex items-center justify-between flex-col h-full">
                <h1>{seller?.username}</h1>
                {!data?.followShop.includes(seller?.username) ? (
                  <Button
                    variant="ghost"
                    className="bg-slate-900"
                    onClick={() => {
                      if (!auth?.user)
                        return toast.error("You must be logged in");
                      handleFollowShop(data, seller, idUser);
                    }}
                  >
                    + Follow Shop
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="bg-slate-900"
                    onClick={() => {
                      if (!auth?.user)
                        return toast.error("You must be logged in");
                      handleUnFollowShop(data, seller, idUser);
                    }}
                  >
                    unfollow
                  </Button>
                )}
              </div>
            </div>
            <div className="h-full flex md:flex-col justify-between md:col-span-2 gap-2  flex-wrap md:mt-0 mt-4 text-sm ">
              <p className="flex items-center gap-1 md:gap-3">
                <FiShoppingBag className="md:text-xl text-sm" />
                Products : {products.length > 0 ? products.length : 0}
              </p>
              <p className="flex items-center gap-1 md:gap-3">
                <FiStar className="md:text-xl text-sm" />
                Ratings : 4.6
              </p>
              <p className="flex items-center gap-1 md:gap-3">
                <FiUsers className="md:text-xl text-sm" />
                Follower :{" "}
                {seller ? (seller.followers > 0 ? seller.followers : 0) : 0}
              </p>
            </div>
          </div>
          <article className="pb-4 border-b-2 border-b-gray-700">
            <h1 className="text-xl underline underline-offset-2 mb-4">
              About this shop
            </h1>
            <p>{seller?.description_shop}</p>
          </article>
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <Title text="Products" size="lg:text-2xl text-xl" />
              <Select
                options={category}
                placeholder="Select category"
                isMulti
                components={animate}
                closeMenuOnSelect={false}
                className="text-black"
                onChange={handleFilter}
              />
            </div>
            <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 place-items-center mt-4 gap-4">
              {filterProducts.length > 0 ? (
                filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    return <CardProduct data={product} key={product.id} />;
                  })
                ) : (
                  <p className="lg:col-span-6 md:col-span-4 col-span-2 text-center text-lg">
                    Product not found
                  </p>
                )
              ) : (
                products.map((product) => {
                  return <CardProduct data={product} key={product.id} />;
                })
              )}
            </div>
          </div>
        </section>
      )}
    </DefaultLayout>
  );
};

export default ViewShop;
