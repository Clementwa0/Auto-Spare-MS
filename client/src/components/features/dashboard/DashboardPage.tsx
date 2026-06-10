import { useEffect, useState } from "react";
import { fetchDashboardStats } from "@/services/dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, Package, AlertTriangle} from "lucide-react";
import { toast } from "sonner";
import type { Part } from "@/types/type";
import { Link } from "react-router-dom";
import DashboardCard from "./DashboardCard";
import OutOfStock from "../reports/OutOfStock";
import Loader from "@/constants/Loader";

interface DashboardStats {
  totalParts: number;
  lowStockCount: number;
  todaySales: number;
  totalExpenses: number;
  outOfStockParts: Part[];
  lowStockParts: Part[];
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "text-primary",
  className = "",
}: {
  title: string;
  value: string | number;
  icon: any;
  color?: string;
  className?: string;
}) => (
  <Card
    className={`flex-1 min-w-[200px] shadow-md transition-all duration-300 hover:shadow-lg ${className}`}
  >
    <CardHeader className="flex items-center justify-between">
      <CardTitle className="text-base font-medium text-gray-600">
        {title}
      </CardTitle>
      <Icon className={`w-6 h-6 ${color}`} />
    </CardHeader>
    <CardContent>
      <p className="text-2xl md:text-3xl font-bold text-gray-800">{value}</p>
    </CardContent>
  </Card>
);


export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalParts: 0,
    lowStockCount: 0,
    todaySales: 0,
    totalExpenses: 0,
    outOfStockParts: [],
    lowStockParts: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading)
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader />
      <p className="mt-4 text-gray-600 text-lg font-medium">
        Loading dashboard items...
      </p>
    </div>
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Overview of sales and inventory</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/parts">
          <StatCard title="Total Parts" value={stats.totalParts} icon={Package} />
        </Link>
        <Link
          to="/reports/low-stock"
          className="block transition-transform hover:scale-[1.02]"
          aria-label="View Low Stock Items"
        >
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockCount}
            icon={AlertTriangle}
            color="text-yellow-600"
            className={
              stats.lowStockCount > 0
                ? "bg-yellow-50 border-l-4 border-yellow-500"
                : ""
            }
          />
        </Link>

        <StatCard
          title="Today's Sales"
          value={`KES ${stats.todaySales.toLocaleString()}`}
          icon={DollarSign}
          color="text-green-600"
        />
        <StatCard
          title="Total Expenses"
          value={`KES ${stats.totalExpenses.toLocaleString()}`}
          icon={DollarSign}
          color="text-red-500"
        />
      </div>

      {/* Out of Stock Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <DashboardCard />
          {stats.outOfStockParts.length > 0 && (
            <OutOfStock
              items={stats.outOfStockParts}
              viewAllLink="/inventory?stockStatus=out"
            />
          )}
        </div>
      </div> 
    </div>
  );
}
