import { motion } from "framer-motion";
import { category } from "@/components/Fragments/FormProduct";
import { Input } from "../ui/input";
import { IoMdClose } from "react-icons/io";

type SidebarProps = {
  filterProduct: string[];
  setFilterProduct: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchProducts: React.Dispatch<React.SetStateAction<string>>;
  searchProducts: string;
  handleSidebar?: () => void;
};

const Sidebar = ({
  filterProduct,
  setFilterProduct,
  setSearchProducts,
  searchProducts,
  handleSidebar,
}: SidebarProps) => {
  const handleFilter = (item: string) => {
    const checkExist = filterProduct.find((product) => product === item);
    if (checkExist) {
      const filters = filterProduct.filter((product) => product !== checkExist);
      setFilterProduct([...filters]);
    } else {
      setFilterProduct((prev) => [...prev, item]);
    }
  };
  return (
    <aside
      className={`text-white w-full md:bg-[#1e1e1e84] bg-primary p-6 md:p-3 h-full sticky max-h-[100svh] top-0`}
    >
      <IoMdClose
        className="absolute right-10 block lg:hidden text-2xl"
        onClick={handleSidebar}
      />
      <ul className="grid gap-9 side-list text-lg place-items-center">
        <motion.li className="w-full p-2">
          <h2 className="text-sm">Search</h2>
          <Input
            placeholder="Search some products..."
            className="text-black mt-4"
            value={searchProducts}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchProducts(e.target.value)
            }
          />
        </motion.li>
        <motion.li layout className="w-full p-2">
          <h2 className="text-sm">Filter product by categories : </h2>
          <div className="w-full flex flex-wrap gap-3 mt-4">
            {category
              .map((items) => items.value)
              .map((item, i) => (
                <button
                  key={i}
                  className={`border-2 border-white px-4 py-2 text-xs transition-all duration-300 ease-linear ${
                    filterProduct.includes(item) ? "bg-white text-black" : null
                  }`}
                  onClick={() => handleFilter(item)}
                >
                  {item}
                </button>
              ))}
          </div>
        </motion.li>
      </ul>
    </aside>
  );
};

export default Sidebar;
