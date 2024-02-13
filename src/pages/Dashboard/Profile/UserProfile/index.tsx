import { Dispatch, SetStateAction, lazy, useState } from "react";
import HeaderProfile from "./Header";
import { useNavigate } from "react-router-dom";
import { useGetUserById } from "@/hooks/useGetUserById";
import { ToRupiah } from "@/utils/toRupiah";
import { HiArrowNarrowRight, HiShoppingCart } from "react-icons/hi";
import { useGetProductsOwner } from "@/hooks/useGetProductsOwner";
const CardProduct = lazy(() => import("@/components/CardProduct"));
import Select, { SingleValue } from "react-select";
import ProductDataTable from "@/features/products/data-table";
import { columnsProductsOwner } from "@/features/products/columnsProductsOwner";
import CartModal from "@/features/cart/CartModal";

type UserProfileProps = {
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
};

const UserProfile = ({ setIsOpenEdit }: UserProfileProps) => {
  const navigate = useNavigate();
  const { data, user, id } = useGetUserById();
  const [layout, setLayout] = useState<
    SingleValue<{ label: string; value: string }>
  >({ label: "Card", value: "card" });
  const products = useGetProductsOwner(id ?? "");
  const selectLayoutProducts = [
    { label: "Card", value: "card" },
    {
      label: "Tabel",
      value: "tabel",
    },
  ];

  const handleLayout = (
    option: SingleValue<{ label: string; value: string }>
  ) => {
    console.log(option);
    setLayout(option);
  };
  return (
    <section className="px-4 pt-4 pb-10">
      <HeaderProfile setIsOpenEdit={setIsOpenEdit} />
      <div className="my-6 flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <h2>Your Cash</h2>
          <p className="text-2xl">
            {user ? ToRupiah(data?.e_wallet ?? 0) : null}
          </p>
        </div>
        <CartModal />
      </div>
      <div
        className="my-4 flex items-center justify-between bg-white/40 p-4 rounded-md cursor-pointer"
        onClick={() => navigate("/profile/transaction")}
      >
        <h1>Your Transaction History</h1>
        <HiArrowNarrowRight />
      </div>
      {data ? (
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
              <div className="w-full flex items-center justify-between">
                <h1 className="md:text-xl text-md">Your Product</h1>
                <Select
                  options={selectLayoutProducts}
                  defaultValue={selectLayoutProducts[0]}
                  className="text-black w-40"
                  onChange={handleLayout}
                />
              </div>
              <div className="grid lg:grid-cols-6 gap-2 lg:gap-3 md:grid-cols-4 grid-cols-2 mt-4">
                {layout?.value === "card" ? (
                  products.map((data) => {
                    return <CardProduct data={data} key={data.id} />;
                  })
                ) : (
                  <ProductDataTable
                    data={products}
                    columns={columnsProductsOwner}
                    className="lg:col-span-6 md:col-span-4 col-span-2"
                  />
                )}
              </div>
            </div>
          </>
        ) : null
      ) : null}
    </section>
  );
};

export default UserProfile;
