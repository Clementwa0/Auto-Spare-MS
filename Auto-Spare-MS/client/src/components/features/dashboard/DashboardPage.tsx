import { useEffect, useState } from "react";
import { fetchDashboardStats } from "@/services/dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DollarSign, Package, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import DashboardCard from "./DashboardCard";
import OutOfStockCard from "./OutOfStock";
import type { Part } from "@/types/type";
import { Link } from "react-router-dom";

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
  <Card className={`flex-1 min-w-[200px] shadow-md transition-all duration-300 hover:shadow-lg ${className}`}>
    <CardHeader className="flex items-center justify-between">
      <CardTitle className="text-base font-medium text-gray-600">{title}</CardTitle>
      <Icon className={`w-6 h-6 ${color}`} />
    </CardHeader>
    <CardContent>
      <p className="text-2xl md:text-3xl font-bold text-gray-800">{value}</p>
    </CardContent>
  </Card>
);

const LowStockCard = ({ items }: { items: Part[] }) => {
  return (
    <Card id="low-stock-section" className="border-l-4 border-yellow-500 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <AlertTriangle className="w-5 h-5" />
          Low Stock Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-gray-500 italic">No low stock items</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div 
                key={item._id} 
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="font-medium text-gray-800 truncate">{item.description}</span>
                <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium whitespace-nowrap">
                  Stock: {item.qty}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {items.length > 0 && (
        <CardFooter className="border-t border-yellow-100 pt-4">
          <Link
            to="/inventory?stockStatus=low"
            className="flex items-center gap-1 text-yellow-700 hover:text-yellow-900 font-medium transition-colors"
          >
            View all low stock items <ArrowRight className="w-4 h-4" />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalParts: 0,
    lowStockCount: 0,
    todaySales: 0,
    totalExpenses: 0,
    outOfStockParts: [],
    lowStockParts: [],
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
    <div className="space-y-6 p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of sales and inventory</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Parts" 
          value={stats.totalParts} 
          icon={Package} 
        />
        
        <Link to="#low-stock-section" className="block transition-transform hover:scale-[1.02]">
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockCount}
            icon={AlertTriangle}
            color="text-yellow-600"
            className={stats.lowStockCount > 0 ? "bg-yellow-50 border-l-4 border-yellow-500" : ""}
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
      
      {/* Dashboard Chart */}
      <DashboardCard />
      
      {/* Out of Stock Card */}
      {stats.outOfStockParts.length > 0 && (
        <OutOfStockCard 
          items={stats.outOfStockParts} 
          viewAllLink="/inventory?stockStatus=out" 
        />
      )}
      
      {/* Low Stock Card */}
      <LowStockCard items={stats.lowStockParts} />
    </div>
  );
}