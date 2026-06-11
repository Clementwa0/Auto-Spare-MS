import api from "@/lib/api";

interface SaleItem {
  part: string;
  qty: number;
  selling_price: number;
  buying_price: number;
}

interface CreateSalePayload {
  items: SaleItem[];
  total: number;
  cashier?: string;
}

export const createSale = async ({
  items,
  total,
  cashier,
}: CreateSalePayload) => {
  const res = await api.post("/sales", {
    items,
    total,
    cashier,
  });

  return res.data;
};

export const fetchTodaySales = async () => {
  const res = await api.get("/sales?today=true");
  return res.data;
};