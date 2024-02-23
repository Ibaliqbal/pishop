import { Dispatch, SetStateAction, lazy, useState } from "react";
import HeaderProfile from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserById } from "@/hooks/useGetUserById";
import { ToRupiah } from "@/utils/toRupiah";
import { HiArrowNarrowRight, HiBell } from "react-icons/hi";
import { useGetProductsOwner } from "@/hooks/useGetProductsOwner";
const CardProduct = lazy(() => import("@/components/CardProduct"));
import Select, { SingleValue } from "react-select";
import ProductDataTable from "@/features/products/data-table";
import { columnsProductsOwner } from "@/features/products/columnsProductsOwner";
import CartModal from "@/features/cart/CartModal";
import Chart from "@/features/chart/Chart";
import { motion } from "framer-motion";
import { FaTruck } from "react-icons/fa";
import { useOnTheWay } from "@/hooks/useOnTheWay";
import { useComments } from "@/hooks/useComments";

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
  const { onTheWay } = useOnTheWay();
  const { giftComments } = useComments();

  const selectLayoutProducts = [
    { label: "Card", value: "card" },
    {
      label: "Tabel",
      value: "tabel",
    },
  ];

  const selectProfit = [
    { label: "Per 5 days", value: "Per 5 days" },
    { label: "Per 5 months", value: "Per 5 months" },
  ];

  const handleLayout = (
    option: SingleValue<{ label: string; value: string }>
  ) => {
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
        <div className="flex items-center gap-6">
          <Link className="relative" to={"/gift_rating"}>
            <HiBell className="text-4xl cursor-pointer" />
            {giftComments && giftComments.length > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-6 h-6 bg-red-500 text-white absolute -top-2 rounded-full text-sm text-center -right-2"
              >
                {giftComments?.length <= 99 ? giftComments.length : "99+"}
              </motion.p>
            )}
          </Link>
          <Link className="relative" to={"/on_the_way"}>
            <FaTruck className="text-4xl cursor-pointer" />
            {onTheWay && onTheWay.length > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-6 h-6 bg-red-500 text-white absolute -top-2 rounded-full text-sm text-center -right-2"
              >
                {onTheWay?.length <= 99 ? onTheWay.length : "99+"}
              </motion.p>
            )}
          </Link>
          <CartModal />
        </div>
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
          <main className="w-full">
            <div
              className="my-4 flex items-center justify-between bg-white/40 p-4 rounded-md cursor-pointer"
              onClick={() => navigate("/add_new_product")}
            >
              <h1>Create New Product</h1>
              <HiArrowNarrowRight />
            </div>
            <Link
              to={"/purchase_history"}
              className="my-4 flex items-center justify-between bg-white/40 p-4 rounded-md cursor-pointer"
            >
              <h1>Purchase History</h1>
              <HiArrowNarrowRight />
            </Link>
            <div className="w-full overflow-y-auto max-w-full mt-10 md:mb-10 mb-16">
              <div className="w-full flex justify-between  items-center mb-10">
                <h2 className="text-xl">Your Profit Shop</h2>
                <Select
                  options={selectProfit}
                  className="text-black w-1/6"
                  defaultValue={selectProfit[0]}
                />
              </div>
              <Chart />
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
                    type="list"
                  />
                )}
              </div>
            </div>
          </main>
        ) : null
      ) : null}
    </section>
  );
};

export default UserProfile;
