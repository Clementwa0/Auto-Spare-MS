import api from "@/lib/api";

export async function fetchDashboardStats() {
  const [partsRes, salesRes, expensesRes, lowStockRes] =
    await Promise.all([
      api.get("/spare-parts"),
      api.get("/sales?today=true"),
      api.get("/expenses"),
      api.get("/spare-parts/low-stock"),
    ]);

  const allParts = partsRes.data || [];
  const todaySales = salesRes.data || [];
  const expenses = expensesRes.data || [];

  const totalRevenue = todaySales.reduce(
    (sum: number, sale: any) => sum + Number(sale.total || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum: number, exp: any) => sum + Number(exp.amount || 0),
    0
  );

  const outOfStockParts = allParts.filter(
    (part: any) => Number(part.qty) === 0
  );

  return {
    totalParts: allParts.length,
    lowStockCount: lowStockRes.data.count || 0,
    todaySales: totalRevenue,
    totalExpenses,
    outOfStockParts,
    lowStockParts: lowStockRes.data.parts || [],
  };
}