import api from "@/lib/api";
import type { Part } from "@/types/type";

export const fetchParts = async (): Promise<Part[]> => {
  const response = await api.get("/spare-parts");
  return response.data;
};

export const fetchPartsByCategory = async (categoryId: string) => {
  const res = await api.get("/spare-parts", { params: { category: categoryId } });
  return res.data;
};

export const fetchPartById = async (id: string): Promise<Part> => {
  const response = await api.get(`/spare-parts/${id}`);
  return response.data;
};

export const updatePartQty = async (
  partId: string,
  data: { qty: number }
): Promise<Part> => {
  const res = await api.patch(`/spare-parts/${partId}`, data);
  return res.data;
};

export async function createPart(data: any) {
  try {
    const res = await api.post("/spare-parts", data);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to create part");
  }
}
