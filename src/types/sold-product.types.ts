// types/sold-product.types.ts
export type SoldProduct = {
  id: number;
  name: string;
  soldPrice: number;
  image: string;
  stockSold: number;
  subtotal: number;
  discount: number;
  total: number;
  saleDate: string;
};
