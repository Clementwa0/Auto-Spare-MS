import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { Part } from "@/types/type";
import { fetchDashboardStats } from "@/services/dashboard"; // reuse to get low stock parts

const LowStockPage = () => {
  const [lowStockParts, setLowStockParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLowStockParts = async () => {
      try {
        const data = await fetchDashboardStats(); // or create a dedicated fetchLowStockParts()
        setLowStockParts(data.lowStockParts);
      } catch (error) {
        toast.error("Failed to load low stock items");
      } finally {
        setLoading(false);
      }
    };
    loadLowStockParts();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
        Low Stock Items
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Card
          id="low-stock-section"
          className="border-l-4 border-yellow-500 bg-yellow-50"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Items
            </CardTitle>
          </CardHeader>

          <ul>
            {lowStockParts.length === 0 ? (
              <p className="text-gray-500 italic p-4">No low stock items</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {lowStockParts.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="font-medium text-gray-800 truncate">
                      {item.description}
                    </span>
                    <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium whitespace-nowrap">
                      Stock: {item.qty}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ul>

          {lowStockParts.length > 0 && (
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
      )}
    </div>
  );
};

export default LowStockPage;
