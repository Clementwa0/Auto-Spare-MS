import api from "@/lib/api";

export async function fetchDashboardStats() {
  const [partsRes, salesRes] = await Promise.all([
    api.get("/spare-parts"),       // All parts
    api.get("/getSales"),  // Sales from today
  ]);

  const allParts = partsRes.data;
  const todaySales = salesRes.data;

  return {
    totalParts: allParts.length,
    lowStockCount: allParts.filter((p: any) => p.qty < 10).length,
    todaySales: todaySales.reduce(
      (total: number, sale: any) => total + sale.quantity * sale.price,
      0
    ),
  };
}
