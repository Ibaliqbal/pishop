import DefaultLayout from "@/components/Layout/DefaultLayout";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { useGetPurchase } from "@/hooks/useGetPurchase";
import { ToRupiah } from "@/utils/toRupiah";
import { BsArrowLeft } from "react-icons/bs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { TfiReload } from "react-icons/tfi";

const Purchase = () => {
  const {
    purchases,
    loading,
    handleConfirm,
    loadingConfirm,
    handleRemoveOrder,
  } = useGetPurchase();

  return (
    <DefaultLayout>
      <section className="p-4 text-white pb-24 md:pb-10">
        <button
          onClick={() => history.back()}
          className="text-white text-3xl mb-10"
        >
          <BsArrowLeft />
        </button>
        <Title text="Purchase" size="text-3xl" />
        {loading ? (
          <div className="loader" />
        ) : purchases.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {purchases.map((p, i) => {
              return (
                <AccordionItem
                  key={p.orderId}
                  value={`item-${i + 1}`}
                  className="w-full"
                >
                  <AccordionTrigger>
                    <motion.main
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 1,
                        delay: i * 0.2,
                        type: "spring",
                        bounce: 0.5,
                      }}
                      className="w-full flex md:flex-row flex-col gap-4 md:items-center items-start hover:no-underline"
                    >
                      <img
                        src={p.thumbnail}
                        alt={p.name_product}
                        className="w-[150px] h-[150px] md:grow-0"
                      />
                      <div className="flex flex-col h-full justify-around md:grow md:gap-16 md:items-start">
                        <h2 className="text-lg font-bold no-underline">
                          {p.name_product}
                        </h2>
                        <p className="text-sm">
                          Total : {ToRupiah(p.totalPrice / p.qty)} X {p.qty} ={" "}
                          {ToRupiah(p.totalPrice)}
                        </p>
                      </div>
                    </motion.main>
                  </AccordionTrigger>
                  <AccordionContent>
                    <h1 className="my-4 md:text-xl text-lg">
                      Order Id : {p.orderId}{" "}
                    </h1>
                    <div className="flex flex-col gap-6">
                      <h2 className="text-xl md:text-2xl">Detail Customer</h2>
                      <div className="flex flex-row gap-4">
                        <h3 className="basis-1/4">Name</h3>
                        <p className="basis-1/5">:</p>
                        <p className="basis-1/2">{p.detailCus?.nameCus}</p>
                      </div>
                      <div className="flex flex-row gap-4">
                        <h3 className="basis-1/4">Email</h3>
                        <p className="basis-1/5">:</p>
                        <p className="basis-1/2">{p.detailCus?.emailCus}</p>
                      </div>
                      <div className="flex flex-row gap-4">
                        <h3 className="basis-1/4">Address</h3>
                        <p className="basis-1/5">:</p>
                        <p className="basis-1/2">{p.detailCus?.addressCus}</p>
                      </div>
                      <h2 className="text-xl md:text-2xl">Detail Product</h2>
                      <div className="flex flex-row gap-4">
                        <h3 className="basis-1/4">Status</h3>
                        <p className="basis-1/5">:</p>
                        <p className="basis-1/2 capitalize">
                          {p.status?.split("_").join(" ")}
                        </p>
                      </div>
                      {p.size && (
                        <div className="flex flex-row gap-4">
                          <h3 className="basis-1/4">Size</h3>
                          <p className="basis-1/5">:</p>
                          <p className="basis-1/2 capitalize">{p.size}</p>
                        </div>
                      )}
                      {p.status === "pending" && (
                        <Button
                          variant={"ghost"}
                          onClick={() =>
                            handleConfirm(p.id_user, p.orderId, p.id_product)
                          }
                          size={"lg"}
                          className="bg-green-600 hover:bg-green-800 hover:text-white md:self-start self-end mt-4"
                        >
                          {loadingConfirm ? (
                            <TfiReload className="animate-spin text-xl" />
                          ) : (
                            "Confirm Order"
                          )}
                        </Button>
                      )}
                      {p.status === "order_received" && (
                        <Button
                          variant={"ghost"}
                          onClick={() => handleRemoveOrder(p.orderId)}
                          size={"lg"}
                          className="bg-red-600 hover:bg-red-800 hover:text-white md:self-start self-end mt-4"
                        >
                          {loadingConfirm ? (
                            <TfiReload className="animate-spin text-xl" />
                          ) : (
                            "Remove Order"
                          )}
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <p>Tidak ada barang</p>
        )}
      </section>
    </DefaultLayout>
  );
};

export default Purchase;
