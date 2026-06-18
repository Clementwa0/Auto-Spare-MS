import { useEffect, useState } from "react";
import { fetchTodaySales } from "@/services/sale";
import type { Part } from "@/types/type";

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

import { Skeleton } from "@/components/ui/skeleton";
import { List } from "lucide-react";

interface Sale {
  _id: string;
  total: number;
  date: string;
  items: {
    part: Part;
    qty: number;
    selling_price: number;
    buying_price: number;
  }[];
}

export default function AdminDashboard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSales = async () => {
      try {
        setLoading(true);
        const data = await fetchTodaySales();
        setSales(data);
      } catch (error) {
        console.error("Failed to fetch sales", error);
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, []);

  const soldItems = sales
    .flatMap((sale) =>
      sale.items.map((item) => ({
        id: `${sale._id}-${item.part._id}`,
        description: item.part.description,
        partNo: item.part.part_no,
        qty: item.qty,
        price: item.selling_price,
        date: new Date(sale.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }))
    )
    .slice(0, 10);

  return (
    <div className="p-1 md:p-2 space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <List className="w-5 h-5 mr-2 text-primary" />
              <CardTitle>Recent Sold Items</CardTitle>
            </div>

            {!loading && (
              <span className="text-sm text-muted-foreground">
                {soldItems.length} Items
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">
                    Time
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-4 w-8 mx-auto" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-4 w-16 ml-auto" />
                      </TableCell>

                      <TableCell className="hidden sm:table-cell">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : soldItems.length > 0 ? (
                  soldItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium max-w-[220px] truncate">
                        {item.description}
                      </TableCell>

                      <TableCell className="text-center">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          {item.qty}
                        </span>
                      </TableCell>

                      <TableCell className="text-right font-medium">
                        KES {item.price.toLocaleString()}
                      </TableCell>

                      <TableCell className="hidden sm:table-cell text-right text-muted-foreground">
                        {item.date}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No sales recorded today
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View */}
          <div className="sm:hidden mt-4 space-y-2">
            {!loading &&
              soldItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-3 flex justify-between items-center"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.description}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.partNo}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      KES {item.price.toLocaleString()}
                    </p>

                    <span className="text-xs text-blue-600">
                      Qty: {item.qty}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}