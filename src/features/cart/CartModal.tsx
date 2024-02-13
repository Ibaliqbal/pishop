import React from "react";
import { HiShoppingCart } from "react-icons/hi";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart.context";

const CartModal = () => {
    const cart = useCart()
  return (
    <Sheet>
      <SheetTrigger>
        <HiShoppingCart className="text-2xl cursor-pointer" title="Cart" />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
        </SheetHeader>
        <div className="grow bg-blue-200 h-[200vh]">hello</div>
        <SheetFooter>
          <Button className="text-white">Checkout</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartModal;
