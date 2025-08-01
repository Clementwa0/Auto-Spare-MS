import { useEffect, useState } from "react";
import { fetchDashboardStats } from "@/services/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, AlertTriangle} from "lucide-react";
import { toast } from "sonner";

interface DashboardStats {
  totalParts: number;
  lowStockCount: number;
  todaySales: number;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "text-primary",
}: {
  title: string;
  value: string | number;
  icon: any;
  color?: string;
}) => (
  <Card className="flex-1 min-w-[200px] shadow-md">
    <CardHeader className="flex items-center justify-between">
      <CardTitle className="text-base">{title}</CardTitle>
      <Icon className={`w-6 h-6 ${color}`} />
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalParts: 0,
    lowStockCount: 0,
    todaySales: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of sales and inventory</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Total Parts" value={stats.totalParts} icon={Package} />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockCount}
          icon={AlertTriangle}
          color="text-yellow-600"
        />
        <StatCard
          title="Today's Sales"
          value={`KES ${stats.todaySales.toLocaleString()}`}
          icon={DollarSign}
          color="text-green-600"
        />
      </div>
    </div>
  );
}
