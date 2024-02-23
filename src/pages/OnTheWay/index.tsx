import DefaultLayout from "@/components/Layout/DefaultLayout";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { useOnTheWay } from "@/hooks/useOnTheWay";
import { ToRupiah } from "@/utils/toRupiah";
import { BsArrowLeft } from "react-icons/bs";
import { TfiReload } from "react-icons/tfi";
import { Link } from "react-router-dom";

const OnTheWay = () => {
  const { onTheWay, loading, confirmProductRecieved } = useOnTheWay();

  return (
    <DefaultLayout>
      <section className="p-4 text-white pb-24 md:pb-10">
        <button
          onClick={() => history.back()}
          className="text-white text-3xl mb-10"
        >
          <BsArrowLeft />
        </button>
        <Title text="Your Order" size="text-3xl" />
        <section className="w-full flex flex-col gap-4 mt-6">
          {onTheWay === null ? (
            <div className="loader" />
          ) : onTheWay?.length > 0 ? (
            onTheWay?.map((otw) => (
              <article
                key={otw.idOrder}
                className="w-full flex gap-4 pb-6 border-b-2 border-b-gray-700"
              >
                <Link to={`/${otw.idProduct}`} className="md:grow-0">
                  <img
                    src={otw.product[0].thumbnail}
                    alt={otw.product[0].name_product}
                    className="w-[150px] h-[150px]"
                  />
                </Link>
                <div className="md:grow flex items-start flex-col justify-around">
                  <h2 className="text-lg font-bold">
                    {otw.product[0].name_product}
                  </h2>
                  <p className="tracking-wider">
                    Total : {ToRupiah(otw.product[0].price)} X{" "}
                    {otw.product[0].quantity} ={" "}
                    {ToRupiah(otw.product[0].price * otw.product[0].quantity)}
                  </p>
                </div>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    confirmProductRecieved(otw.product[0], otw.idOrder, otw.id)
                  }
                  className="md:grow-0 self-end bg-green-600 hover:bg-green-800 hover:text-white"
                >
                  {loading.status && loading.id === otw.idOrder ? (
                    <TfiReload className="animate-spin text-xl" />
                  ) : (
                    "Barang diterima"
                  )}
                </Button>
              </article>
            ))
          ) : (
            <p className="text-center">Tidak Ada Order</p>
          )}
        </section>
      </section>
    </DefaultLayout>
  );
};

export default OnTheWay;
