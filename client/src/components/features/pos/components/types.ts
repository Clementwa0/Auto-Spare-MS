import type { Part } from "@/types/type";

export interface CartItem {
  part: Part;
  quantity: number;
}

export const ALL_PARTS = "All Parts";

export const formatKES = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
