import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  fetchLowStockParts,
  type LowStockPart,
} from "@/services/part";

const LowStockPage = () => {
  const [parts, setParts] = useState<LowStockPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(10);

  useEffect(() => {
    loadLowStockParts();
  }, []);

  const loadLowStockParts = async () => {
    try {
      setLoading(true);

      const data = await fetchLowStockParts();

      setParts(data.parts || []);
      setThreshold(data.threshold || 10);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load low stock items");
      setParts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-600" />
          <p className="mt-2 text-muted-foreground">
            Loading low stock items...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-amber-50">
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5" />

            Low Stock Items

            <span className="ml-2 rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold">
              {parts.length}
            </span>
          </CardTitle>

          <p className="text-sm text-amber-700">
            Items with stock less than or equal to {threshold}
          </p>
        </CardHeader>

        <CardContent className="p-0">
          {parts.length === 0 ? (
            <div className="py-10 text-center px-4">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
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

              <h3 className="font-medium text-gray-800">
                No low stock items
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                All inventory levels are healthy.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Cards */}
             {/* Mobile Compact List */}
<div className="block md:hidden">
  <div className="divide-y">
    {parts.map((part) => (
      <div
        key={part._id}
        className="p-3 flex items-center justify-between"
      >
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">
            {part.part_no}
          </p>

          <p className="text-xs text-muted-foreground truncate">
            {part.description}
          </p>

          <p className="text-xs text-gray-500">
            {part.category}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 ml-3">
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
            {part.qty}
          </span>

          <span className="text-[10px] text-amber-700">
            Low Stock
          </span>
        </div>
      </div>
    ))}
  </div>
</div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Part Number</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-center">
                        Current Qty
                      </TableHead>
                      <TableHead className="text-center">
                        Threshold
                      </TableHead>
                      <TableHead className="text-right">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {parts.map((part) => (
                      <TableRow key={part._id}>
                        <TableCell className="font-medium">
                          {part.part_no}
                        </TableCell>

                        <TableCell>
                          {part.code || "-"}
                        </TableCell>

                        <TableCell>
                          {part.description}
                        </TableCell>

                        <TableCell>
                          {part.category}
                        </TableCell>

                        <TableCell className="text-center">
                          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                            {part.qty}
                          </span>
                        </TableCell>

                        <TableCell className="text-center">
                          {part.min}
                        </TableCell>

                        <TableCell className="text-right">
                          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                            Low Stock
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LowStockPage;