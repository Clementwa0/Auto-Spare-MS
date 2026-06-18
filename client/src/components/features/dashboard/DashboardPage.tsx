import { useEffect, useState } from "react";
import { fetchDashboardStats } from "@/services/dashboard";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
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
  color,
  bg,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  bg: string;
}) => (
  <Card className="overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-md text-muted-foreground">{title}</p>

          <h3 className="mt-2 text-2xl md:text-xl font-bold tracking-tight">
            {value}
          </h3>
        </div>

        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center ${bg}`}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader />
        <p className="mt-4 text-muted-foreground">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-3 md:p-6">
      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Link to="/parts">
          <StatCard
            title="Total Parts"
            value={stats.totalParts}
            icon={Package}
            color="text-blue-600"
            bg="bg-blue-100"
          />
        </Link>

        <Link to="/reports/low-stock">
          <StatCard
            title="Low Stock"
            value={stats.lowStockCount}
            icon={AlertTriangle}
            color="text-yellow-600"
            bg="bg-yellow-100"
          />
        </Link>

        <StatCard
          title="Today's Sales"
          value={`KES ${stats.todaySales.toLocaleString()}`}
          icon={TrendingUp}
          color="text-green-600"
          bg="bg-green-100"
        />

        <StatCard
          title="Expenses"
          value={`KES ${stats.totalExpenses.toLocaleString()}`}
          icon={DollarSign}
          color="text-red-600"
          bg="bg-red-100"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Dashboard Summary */}
        <div className="lg:col-span-2">
          <DashboardCard />
        </div>

        {/* Quick Summary */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-lg mb-4">
              Inventory Summary
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Total Parts
                </span>
                <span className="font-semibold">
                  {stats.totalParts}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Low Stock
                </span>
                <span className="font-semibold text-yellow-600">
                  {stats.lowStockCount}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Out of Stock
                </span>
                <span className="font-semibold text-red-600">
                  {stats.outOfStockParts.length}
                </span>
              </div>

              <div className="border-t pt-4 flex justify-between">
                <span className="text-muted-foreground">
                  Revenue Today
                </span>
                <span className="font-bold text-green-600">
                  KES {stats.todaySales.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Out of Stock */}
      {stats.outOfStockParts.length > 0 && (
        <div>
          <OutOfStock
            items={stats.outOfStockParts}
            viewAllLink="/inventory?stockStatus=out"
          />
        </div>
      )}
    </div>
  );
}