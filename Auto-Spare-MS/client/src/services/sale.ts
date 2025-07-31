import api from "@/lib/api";

interface SaleInput {
  partId: string;
  quantity: number;
}

export const createSale = async ({ partId, quantity }: SaleInput) => {
  const res = await api.post("/sales", { partId, quantity });
  return res.data;
};
