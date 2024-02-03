import { Dispatch, SetStateAction, useEffect, useState } from "react";
import HeaderProfile from "./Header";
import { HiOutlineShoppingBag, HiArrowNarrowRight } from "react-icons/hi";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";
import { useGetUserById } from "@/hooks/useGetUserById";
import { useGetProductByOwner } from "@/hooks/useGetProductByOwner";

type UserProfileProps = {
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
};

const UserProfile = ({ setIsOpenEdit }: UserProfileProps) => {
  const navigate = useNavigate();
  const { data, user } = useGetUserById();
  const [product, setProduct] = useState<any>([]);
  const products = useGetProductByOwner(data?.username);

  const getProduct = async () => {
    const res = await fetch("https://fakestoreapi.com/products");
    const result = await res.json();
    setProduct(result);
  };
  useEffect(() => {
    getProduct();
    const owner = products.filter(
      (data) => data.name_seller === "Iqbal Muthahhary"
    );
    console.log({ owner });
    console.log({ products });
  }, []);
  return (
    <section className="p-4">
      <HeaderProfile setIsOpenEdit={setIsOpenEdit} />
      <div className="flex flex-col gap-3 my-4">
        <h2>Your Cash</h2>
        <p className="text-2xl">
          {user
            ? data?.e_wallet.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })
            : null}
        </p>
      </div>
      <div
        className="my-4 flex items-center justify-between bg-white/40 p-4 rounded-md cursor-pointer"
        onClick={() => navigate("/profile/transaction")}
      >
        <h1>Your Transaction History</h1>
        <HiArrowNarrowRight />
      </div>
      {/* {data ? (
        data.isSeller ? (
          <>
            <div
              className="my-4 flex items-center justify-between bg-white/40 p-4 rounded-md cursor-pointer"
              onClick={() => navigate("/add_new_product")}
            >
              <h1>Create New Product</h1>
              <HiArrowNarrowRight />
            </div>
            <div>
              <h1>Your Product</h1>
              <div className="grid lg:grid-cols-6 gap-6 md:grid-cols-4 grid-cols-2">
                {product.map((data: any) => {
                  return (
                    <div
                      key={data.id}
                      className="flex gap-3 flex-col bg-blue-400 p-4 items-center justify-between"
                    >
                      <img
                        src={data.image}
                        alt=""
                        className="w-[150px] h-[150px]"
                      />
                      <div>
                        <h1 className="text-[12px] md:text-md">{data.title}</h1>
                        <p className="self-start">{data.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : null
      ) : null} */}
      <div>
        <h1>Test</h1>
        {products
          ? products
              .filter((data) => data.name_seller === "Iqbal Muthahhary")
              .map((data) => <p className="text-white">{data.name_product}</p>)
          : null}
      </div>
    </section>
  );
};

export default UserProfile;
