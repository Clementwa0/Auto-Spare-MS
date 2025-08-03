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
import {CreditCard, List } from "lucide-react";

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
      } catch {
        console.error("Failed to fetch sales");
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, []);

  const transactionCount = sales.length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <h2 className="text-2xl md:text-3xl font-bold">
                {transactionCount}
              </h2>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center">
            <List className="w-5 h-5 mr-2 text-primary" />
            <CardTitle>Recent Sold Items</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Part</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">
                    Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-full" />
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
                    ))}
                  </>
                ) : sales.length > 0 ? (
                  sales
                    .flatMap((sale) =>
                      sale.items.map((item) => ({
                        id: `${sale._id}-${item.part._id}`,
                        part: item.part.description,
                        qty: item.qty,
                        price: item.selling_price,
                        date: new Date(sale.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      }))
                    )
                    .slice(0, 5)
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium truncate max-w-[150px]">
                          {item.part}
                        </TableCell>
                        <TableCell className="text-center">{item.qty}</TableCell>
                        <TableCell className="text-right">
                          KES {item.price.toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-right">
                          {item.date}
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No sales recorded today
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}