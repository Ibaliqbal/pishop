import DefaultLayout from "@/components/Layout/DefaultLayout";
import Title from "@/components/Title";
import { Order, useOrder } from "@/hooks/useOrder";
import { ToRupiah } from "@/utils/toRupiah";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const Payment = () => {
  const { id: idOrder } = useParams();
  const [productOrder, setProductOrder] = useState<Order>({} as Order);
  const { orders, loading } = useOrder();
  useEffect(() => {
    const order = orders.find((order) => order.id === idOrder);
    if (order) {
      setProductOrder(order);
    }
  }, [idOrder, orders]);
  return loading && orders ? (
    <div className="loader" />
  ) : (
    <DefaultLayout>
      <section className="p-4 text-white md:pb-10 pb-24">
        <button
          onClick={() => history.back()}
          className="text-white text-3xl mb-10"
        >
          <BsArrowLeft />
        </button>
        <Title text="Your Order" size="text-3xl" />
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-4">
            {productOrder.products?.map((product) => {
              return (
                <article
                  key={product.id_product}
                  className="flex gap-4 md:items-center p-3 md:flex-row flex-col"
                >
                  <Link className="md:grow-0" to={`/${product.id_product}`}>
                    <img
                      src={product.thumbnail}
                      alt={product.name_product}
                      className="md:w-[150px] md:h-[150px] w-[200px] h-[200px] object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex flex-col h-full md:grow gap-10">
                    <h1 className="text-lg font-bold">
                      {product.name_product}
                    </h1>
                    <p className="text-md">
                      {ToRupiah(product.price * product.quantity)}
                    </p>
                  </div>
                  {product.size && (
                    <div className="flex flex-col h-full md:grow-0 gap-10 mr-8 items-center">
                      <h1 className="text-lg font-bold">Size</h1>
                      <p className="text-md">{product.size}</p>
                    </div>
                  )}
                  <p className="md:grow-0 text-md">
                    Items : {product.quantity}
                  </p>
                </article>
              );
            })}
          </div>
          <p>
            Total :{" "}
            {productOrder.totalPrice
              ? ToRupiah(productOrder?.totalPrice)
              : ToRupiah(0)}
          </p>
          <p className="text-lg">Order id : {productOrder.orderId}</p>
          <article className="flex flex-col gap-4">
            <h2 className="underline underline-offset-2 text-lg">
              Detail Customer
            </h2>
            <div className="flex flex-col gap-6">
              <div className="flex flex-row gap-4">
                <h3 className="basis-1/4">Name</h3>
                <p className="basis-1/5">:</p>
                <p className="basis-1/2">
                  {productOrder.detail_customer?.nameCus}
                </p>
              </div>
              <div className="flex flex-row gap-4">
                <h3 className="basis-1/4">Email</h3>
                <p className="basis-1/5">:</p>
                <p className="basis-1/2">
                  {productOrder.detail_customer?.emailCus}
                </p>
              </div>
              <div className="flex flex-row gap-4">
                <h3 className="basis-1/4">Address</h3>
                <p className="basis-1/5">:</p>
                <p className="basis-1/2">
                  {productOrder.detail_customer?.addressCus}
                </p>
              </div>
              <div className="flex flex-row gap-4">
                <h3 className="basis-1/4">Satus Product</h3>
                <p className="basis-1/5">:</p>
                <div className="basis-1/2 flex gap-4 md:flex-row flex-col">
                  {productOrder.products?.map((p, i) => {
                    return (
                      <div className="flex flex-col gap-2" key={p.id_product}>
                        <h3>Product {i + 1}</h3>
                        <p
                          className={`capitalize px-4 py-3 text-center rounded-md ${
                            p.status === "on_the_way" && "bg-green-600"
                          } ${p.status === "pending" && "bg-sky-600"} `}
                        >
                          {p.status.split("_").join(" ")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default Payment;
