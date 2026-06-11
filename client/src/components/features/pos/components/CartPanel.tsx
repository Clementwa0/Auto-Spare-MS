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
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Current sale</h2>
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-1">
                {totalItems}
              </Badge>
            )}
          </div>
          {cart.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-8 text-muted-foreground hover:text-destructive"
            >
              Clear
            </Button>
          )}
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="px-4 py-3">
          {cart.length === 0 ? (
            <EmptyState
              icon={<ShoppingCart className="h-6 w-6" />}
              title="Cart is empty"
              body="Tap a product to start a sale."
              compact
            />
          ) : (
            <ul className="space-y-2">
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
        <div className="border-t bg-background p-4">
          <div className="space-y-1.5 text-sm">
            <CartSummaryRow label={`Subtotal (${totalItems})`} value={formatKES(subtotal)} />
            <CartSummaryRow label="VAT (0%)" value={formatKES(vat)} muted />
          </div>
          <Separator className="my-3" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total</span>
            <span className="text-2xl font-semibold tabular-nums">
              {formatKES(total)}
            </span>
          </div>
          <Button
            onClick={onSell}
            disabled={saleProcessing}
            className="mt-4 h-11 w-full text-sm font-semibold"
          >
            {saleProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>Complete sale · {formatKES(total)}</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
