import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots, BsInfoCircle } from "react-icons/bs";
import { Order } from "@/hooks/useOrder";
import { Link } from "react-router-dom";
import { ToRupiah } from "@/utils/toRupiah";

export const columns: ColumnDef<Order>[] = [
  {
    id: "S.No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
    header: "No",
  },
  {
    header: "Products",
    cell: ({ row }) => {
      const products = row.original.products;
      return (
        <div className="flex gap-4 items-center overflow-y-auto max-w-xl md:max-w-md">
          {products.map((product) => (
            <Link
              to={`/${product.id_product}`}
              key={product.id_product}
              className="flex flex-col items-center gap-4"
            >
              <img
                src={product.thumbnail}
                alt={product.name_product}
                className="md:w-[100px] md:h-[100px] w-[80px] h-[80px]"
              />
              <p className="mt-3 text-center text-sm">
                {product.name_product.length < 12
                  ? product.name_product
                  : `${product.name_product.slice(0, 12)}...`}
              </p>
            </Link>
          ))}
        </div>
      );
    },
  },
  {
    header: "Order Id",
    accessorKey: "orderId",
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="w-[230px] flex flex-wrap gap-6">
          {product.products.map((p, i) => (
            <div
              className="flex flex-col gap-2 items-center"
              key={p.id_product}
            >
              <h4>Product {i + 1}</h4>
              <p
                className={`capitalize px-4 py-3 text-center rounded-md ${
                  p.status === "on_the_way" && "bg-green-600"
                } ${p.status === "pending" && "bg-sky-600"} `}
              >
                {p.status.split("_").join(" ")}
              </p>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    header: "Total",
    cell: ({ row }) => {
      const products = row.original;
      return <p>{ToRupiah(products.totalPrice)}</p>;
    },
  },
  {
    header: "Date",
    cell: ({ row }) => {
      const product = row.original;
      return <p>{product.orderAt.toDate().toLocaleDateString()}</p>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <BsThreeDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link
                className="text-blue-600 flex items-center text-md gap-2"
                to={`/order/${product.orderId}`}
              >
                <BsInfoCircle className="text-xl" /> Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
