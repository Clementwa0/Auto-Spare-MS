import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Part } from "@/types/type";
import { fetchDashboardStats } from "@/services/dashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LowStockPage = () => {
  const [lowStockParts, setLowStockParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLowStockParts = async () => {
      try {
        const data = await fetchDashboardStats();
        setLowStockParts(data.lowStockParts || []);
      } catch (error) {
        toast.error("Failed to load low stock items");
      } finally {
        setLoading(false);
      }
    };
    loadLowStockParts();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-600" />
            <p className="mt-2 text-gray-600">Loading low stock items...</p>
          </div>
        </div>
      ) : (
        <Card className="border-l-4 border-amber-500 shadow-md">
          <CardHeader className="bg-amber-50 pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-800 text-lg md:text-xl">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Items
              {lowStockParts.length > 0 && (
                <span className="ml-2 text-sm font-medium bg-amber-200 px-2 py-1 rounded-full">
                  {lowStockParts.length} item{lowStockParts.length !== 1 ? 's' : ''}
                </span>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {lowStockParts.length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-green-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">All items are well stocked</p>
                <p className="text-gray-500 text-sm mt-1">No low inventory alerts</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[640px] md:min-w-full">
                  <TableHeader className="bg-amber-100/50">
                    <TableRow>
                      <TableHead className="font-semibold text-amber-900 py-3 pl-6">
                        Description
                      </TableHead>
                      <TableHead className="font-semibold text-amber-900 py-3">
                        Part Number
                      </TableHead>
                      <TableHead className="font-semibold text-amber-900 py-3 text-center">
                        Current Stock
                      </TableHead>
                      <TableHead className="font-semibold text-amber-900 py-3 pr-6 text-right">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockParts.map((item) => (
                      <TableRow
                        key={item._id}
                        className="border-b border-amber-100 hover:bg-amber-50 transition-colors"
                      >
                        <TableCell className="font-medium pl-6 py-4 text-sm">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {item.part_no}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                            {item.qty} units
                          </span>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            Low Stock
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LowStockPage;
