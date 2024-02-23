import Sidebar from "@/components/Sidebar";
import Title from "@/components/Title";
import useDebounce from "@/hooks/useDebounce";
import { useGetProducts } from "@/hooks/useGetProducts";
import { useState, lazy, useMemo } from "react";
const CardProduct = lazy(() => import("@/components/CardProduct"));

const ProductList = () => {
  const products = useGetProducts();
  const [filterProduct, setFilterProduct] = useState<string[]>([]);
  const [searchProducts, setSearchProducts] = useState<string>("");
  const debouncedVal = useDebounce(searchProducts, 1000);
  const [sidebarToggle, setSidebarToggle] = useState<boolean>(false);
  const [animateSidebar, setAnimateSidebar] = useState<string>(
    "animate__slideInLeft"
  );
  const handleSidebar = () => {
    if (sidebarToggle) {
      setAnimateSidebar("animate__slideOutLeft animate__fast");
      setTimeout(() => {
        setSidebarToggle(false);
      }, 500);
    } else {
      setAnimateSidebar("animate__slideInLeft");
      setSidebarToggle(true);
    }
  };
  const filteredProducts = useMemo(() => {
    if (debouncedVal) {
      return products
        .filter((item) =>
          item.category_product.some((cate) => filterProduct.includes(cate))
        )
        .filter((item) =>
          item.name_product.toLowerCase().includes(debouncedVal.toLowerCase())
        );
    } else {
      return products.filter((item) =>
        item.category_product.some((cate) => filterProduct.includes(cate))
      );
    }
  }, [filterProduct, debouncedVal, products]);
  return (
    <section className="grid lg:grid-cols-5 gap-4 min-h-[95dvh] mt-10 text-white">
      <div className="lg:col-span-1 lg:block hidden">
        <Sidebar
          filterProduct={filterProduct}
          setFilterProduct={setFilterProduct}
          setSearchProducts={setSearchProducts}
          searchProducts={searchProducts}
        />
      </div>
      {sidebarToggle ? (
        <div className="fixed top-28 left-0 w-screen h-screen bg-black bg-opacity-40 z-20">
          <div
            className={`fixed z-20 w-[90%] flex overflow-y-auto shadow-md animate__animated ${animateSidebar}`}
          >
            <div className="w-full flex">
              <Sidebar
                filterProduct={filterProduct}
                setFilterProduct={setFilterProduct}
                setSearchProducts={setSearchProducts}
                searchProducts={searchProducts}
                handleSidebar={handleSidebar}
              />
            </div>
          </div>
        </div>
      ) : (
        <button
          className="bg-white lg:hidden flex flex-col gap-1 items-center p-3 fixed top-28 left-0 z-10 rounded-r-lg"
          onClick={handleSidebar}
        >
          <span
            className={`w-6 h-[3px] bg-primary transition-all duration-300`}
          ></span>
          <span className={`w-6 h-[3px] bg-primary`}></span>
          <span
            className={`w-6 h-[3px] bg-primary transition-all duration-300`}
          ></span>
        </button>
      )}

      <section className="lg:col-span-4 w-full p-4">
        <Title text="Recomendation" size="text-2xl" />
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 place-items-center md:gap-4 gap-6 pb-20 md:pb-0 w-full">
          {filterProduct.length > 0 ? (
            debouncedVal ? (
              filteredProducts.length > 0 ? (
                filteredProducts.map((data) => {
                  return <CardProduct data={data} key={data.id} />;
                })
              ) : (
                <p className="text-center md:col-span-4 col-span-2 mt-6">
                  Product not found
                </p>
              )
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((data) => {
                return <CardProduct data={data} key={data.id} />;
              })
            ) : (
              <p className="text-center md:col-span-4 col-span-2 mt-6">
                Product not found
              </p>
            )
          ) : debouncedVal ? (
            products
              .filter((item) =>
                item.name_product
                  .toLowerCase()
                  .includes(debouncedVal.toLowerCase())
              )
              .map((data) => <CardProduct data={data} key={data.id} />)
          ) : (
            products.map((data) => {
              return <CardProduct data={data} key={data.id} />;
            })
          )}
        </div>
      </section>
    </section>
  );
};

export default ProductList;
