import api from "@/lib/api";

interface SaleItem {
  part: string;
  qty: number;
  selling_price: number;
  buying_price: number;
}


export const createSale = async ({ items }: { items: SaleItem[] }) => {
  const res = await api.post("/sales", { items });
  return res.data;
};

export const fetchTodaySales = async () => {
  const res = await api.get("/sales?today=true");
  return res.data; 
};