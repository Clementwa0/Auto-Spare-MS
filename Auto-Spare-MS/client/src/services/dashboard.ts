import api from "@/lib/api";

export async function fetchDashboardStats() {
  const [partsRes, salesRes] = await Promise.all([
    api.get("/spare-parts"),
    api.get("/sales?today=true"),
  ]);

  const allParts = partsRes.data;
  const todaySales = salesRes.data;

  return {
    totalParts: allParts.length,
    lowStockCount: allParts.filter((p: any) => p.qty < 10).length,
    todaySales: todaySales.reduce(
      (total: number, sale: any) => total + sale.total, // use `.total` from DB
      0
    ),
  };
}
