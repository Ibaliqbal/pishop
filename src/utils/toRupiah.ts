export function ToRupiah(price: number): string {
  return price.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
}
