import api from "@/lib/api";

export async function fetchDashboardStats() {
  const [partsRes, salesRes, expensesRes] = await Promise.all([
    api.get("/spare-parts"),
    api.get("/sales?today=true"),
    api.get("/expenses"),
  ]);

  const allParts = partsRes.data;
  const todaySales = salesRes.data;
  const expenses = expensesRes.data;

  const totalRevenue = todaySales.reduce((sum: any, sale: { total: any }) => sum + sale.total, 0);
  const totalExpenses = expenses.reduce((sum: any, exp: { amount: any }) => sum + exp.amount, 0);

  const lowStockParts = allParts.filter((p: any) => p.qty > 0 && p.qty < 3);
  const outOfStockParts = allParts.filter((p: any) => p.qty === 0);

  return {
    totalParts: allParts.length,
    lowStockCount: lowStockParts.length,
    todaySales: totalRevenue,
    totalExpenses,
    outOfStockParts,
    lowStockParts,
  };
}
