// React imports
import { useEffect, useState } from "react";

// UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Types & Services
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

const LowStockReport = () => {
  // ----------------- STATE -----------------
  const [lowStockParts, setLowStockParts] = useState<Part[]>([]); // Store low stock parts
  const [loading, setLoading] = useState(true); // Loading indicator

  // ----------------- EFFECT: Fetch low stock parts -----------------
  useEffect(() => {
    const loadLowStockParts = async () => {
      try {
        // Call dashboard stats API and extract low stock items
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

  // ----------------- RENDER -----------------
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {loading ? (
        // ----------------- Loading State -----------------
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-600" />
            <p className="mt-2 text-gray-600">Loading low stock items...</p>
          </div>
        </div>
      ) : (
        // ----------------- Low Stock Report Card -----------------
        <Card className="border-l-4 border-amber-500 shadow-md">
          {/* Card Header */}
          <CardHeader className="bg-amber-50 pb-3">
            <CardTitle className="flex flex-wrap items-center justify-center gap-2 text-amber-800 text-md md:text-xl">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Low Stock Items
              {lowStockParts.length > 0 && (
                <span className="ml-auto md:ml-2 text-xs md:text-sm font-medium bg-amber-200 p-1 rounded-full">
                  {lowStockParts.length} item
                  {lowStockParts.length !== 1 ? "s" : ""}
                </span>
              )}
            </CardTitle>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="p-0">
            {/* ----------------- If no low stock ----------------- */}
            {lowStockParts.length === 0 ? (
              <div className="text-center py-8 px-4">
                {/* Green checkmark icon */}
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
                <p className="text-gray-700 font-medium">
                  All items are well stocked
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  No low inventory alerts
                </p>
              </div>
            ) : (
              <>
                {/* ----------------- Desktop Table ----------------- */}
                <div className="hidden md:block overflow-y-auto max-h-100">
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

                {/* ----------------- Mobile Card List ----------------- */}
                <div className="md:hidden space-y-4 p-4">
                  {lowStockParts.map((item) => (
                    <div
                      key={item._id}
                      className="border border-amber-100 rounded-lg p-3 shadow-sm bg-white"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold max-w-35 text-gray-800">
                          {item.description}
                        </h3>
                        <span className="text-xs  p-1 rounded-full bg-red-100 text-red-700 font-medium">
                          Low Stock
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Part No:{" "}
                        <span className="font-medium">{item.part_no}</span>
                      </p>
                      <p className="text-sm mt-2">
                        <span className="inline-flex px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                          {item.qty} units
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LowStockReport;
  
