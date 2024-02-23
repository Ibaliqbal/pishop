import Title from "@/components/Title";
import { useOrder } from "@/hooks/useOrder";
import ProductDataTable from "@/features/products/data-table";
import { columns } from "./columns";
const Transaction = () => {
  const { orders, loading } = useOrder();

  return (
    <div className="w-full p-4">
      <div>
        <Title text="Transaction" size="text-3xl" />
        {loading ? (
          <div className="loader" />
        ) : (
          <ProductDataTable
            columns={columns}
            data={orders}
            type="transaction"
          />
        )}
      </div>
    </div>
  );
};

export default Transaction;
