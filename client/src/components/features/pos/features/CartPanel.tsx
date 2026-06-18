import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, ShoppingCart } from "lucide-react";
import { CartItemRow } from "./CartItemRow";
import { CartSummaryRow } from "./CartSummaryRow";
import { EmptyState } from "./EmptyState";
import type { CartItem } from "./types";
import { formatKES } from "./types";

interface CartPanelProps {
  cart: CartItem[];
  totalItems: number;
  subtotal: number;
  vat: number;
  total: number;
  saleProcessing: boolean;
  onClear: () => void;
  onRemove: (id: string) => void;
  onQty: (id: string, q: number) => void;
  onSell: () => void;
  hideHeader?: boolean;
}

export function CartPanel({
  cart,
  totalItems,
  subtotal,
  vat,
  total,
  saleProcessing,
  onClear,
  onRemove,
  onQty,
  onSell,
  hideHeader,
}: CartPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {!hideHeader && (
        <div className="flex items-center justify-between border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />

            <h2 className="text-sm font-semibold">
              Cart
            </h2>

            {totalItems > 0 && (
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-[10px]"
              >
                {totalItems}
              </Badge>
            )}
          </div>

          {cart.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
            >
              Clear
            </Button>
          )}
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-2">
          {cart.length === 0 ? (
            <EmptyState
              icon={<ShoppingCart className="h-5 w-5" />}
              title="Cart is empty"
              body="Tap a product to start a sale"
              compact
            />
          ) : (
            <ul className="space-y-1">
              {cart.map((item) => (
                <CartItemRow
                  key={item.part._id}
                  item={item}
                  onQty={onQty}
                  onRemove={onRemove}
                />
              ))}
            </ul>
          )}
        </div>
      </ScrollArea>

      {cart.length > 0 && (
        <div className="border-t bg-background p-3">
          <div className="space-y-1 text-xs">
            <CartSummaryRow
              label={`Subtotal (${totalItems})`}
              value={formatKES(subtotal)}
            />

            <CartSummaryRow
              label="VAT (16%)"
              value={formatKES(vat)}
              muted
            />
          </div>

          <Separator className="my-2" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Total
            </span>

            <span className="text-lg font-bold tabular-nums">
              {formatKES(total)}
            </span>
          </div>

          <Button
            onClick={onSell}
            disabled={saleProcessing}
            className="mt-3 h-9 w-full text-sm font-semibold"
          >
            {saleProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Sell · {formatKES(total)}</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
