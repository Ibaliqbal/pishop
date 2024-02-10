import { Products } from "@/types/products.type";
import { ToRupiah } from "@/utils/toRupiah";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type CardProductProps = {
  data: Products;
};

const CardProduct = ({ data }: CardProductProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, type: "spring" }}
      className="md:h-[450px] h-[350px] rounded-md mt-4 col-span-1 md:w-full w-[150px]"
    >
      <Link
        to={`/${data.id}`}
        className="flex h-full w-full max-h-full flex-col product-card items-center justify-between rounded-md"
      >
        <div className="w-full rounded-t-md">
          <img
            src={data.product_image[0]}
            alt={data.name_product}
            loading="lazy"
            className="w-full lg:h-[250px] h-[200px] rounded-t-md object-cover"
          />
          <span className="bg-green-600 px-3 text-[10px] md:text-md self-start rounded-r-md">
            {data.soldout_product} Terjual
          </span>
        </div>
        <div className="mt-3 lg:p-4 px-3 pb-3 self-start">
          <h1 className="text-sm md:text-md lg:text-xl overflow-hidden text-ellipsis max-h-20 max-w-full">
            {data.name_product.length >= 15
              ? `${data.name_product.slice(0, 15)}...`
              : data.name_product}
          </h1>
          <p className="self-start mt-3 text-[10px] md:text-sm">
            {ToRupiah(data.price_product)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CardProduct;
