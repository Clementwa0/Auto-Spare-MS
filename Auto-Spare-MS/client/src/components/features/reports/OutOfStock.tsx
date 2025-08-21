import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import type { Part } from "@/types/type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  items: Part[];
  viewAllLink?: string;
}

export default function OutOfStock({ items }: Props) {
  return (
    <Card className="bg-red-700 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Out of Stock Parts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm py-4">All parts in stock</p>
        ) : (
          <div className="rounded-md border border-red-600 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-red-600 hover:bg-red-600">
                  <TableHead className="text-gray-100 font-bold py-3">
                    Description
                  </TableHead>
                  <TableHead className="text-gray-100 font-bold py-3">
                    Part Number
                  </TableHead>
                </TableRow>
              </TableHeader>
            </Table>
            
            {/* Scrollable table body container */}
            <div className="overflow-y-auto max-h-64">
              <Table>
                <TableBody>
                  {items.map((part) => (
                    <TableRow
                      key={part._id}
                      className="border-red-600 hover:bg-red-600"
                    >
                      <TableCell className="font-medium py-3">
                        {part.description}
                      </TableCell>
                      <TableCell className="py-3">{part.part_no}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}