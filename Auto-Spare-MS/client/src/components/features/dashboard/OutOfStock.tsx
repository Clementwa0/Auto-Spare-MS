import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import type { Part } from "@/types/type";

interface Props {
  items: Part[];
  viewAllLink?: string;
}

export default function OutOfStockList({ items }: Props) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Out of Stock Parts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-64 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">All parts in stock </p>
        ) : (
          <ul className="text-sm space-y-1">
            {items.map((part) => (
              <li key={part._id} className="border-b pb-1">
                <span className="font-medium">{part.description}</span> 
                <span className="text-muted-foreground text-xs">
                  ({part.part_no})
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
