import api from "@/lib/api";

interface SaleItem {
  part: string;
  qty: number;
  selling_price: number;
  buying_price: number;
}


export const createSale = async (data: {
  items: SaleItem[];
  total: number;
  cashier?: string;
  branch?: string;
}) => {
  const res = await api.post("/sales", data);
  return res.data;
};

export const fetchTodaySales = async () => {
  const res = await api.get("/sales?today=true");
  return res.data; 
};