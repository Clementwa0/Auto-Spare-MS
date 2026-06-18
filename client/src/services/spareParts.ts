import api from "@/lib/api";

export interface LowStockPart {
  _id: string;
  part_no: string;
  code?: string;
  description: string;
  qty: number;
  min: number;
  category: string;
}

export interface LowStockResponse {
  count: number;
  threshold: number;
  parts: LowStockPart[];
}

export const fetchLowStockParts = async (): Promise<LowStockResponse> => {
  const response = await api.get("/spare-parts/low-stock");
  return response.data;
};