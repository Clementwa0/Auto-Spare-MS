import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { CartPanel } from "./components/CartPanel";
import { POSFooter } from "./components/POSFooter";
import { POSHeader } from "./components/POSHeader";
import { ProductGrid } from "./components/ProductGrid";
import { usePOS } from "./components/usepos";

export default function POSPage() {
  const pos = usePOS();

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <div className="mx-auto flex h-screen max-w-[1600px] flex-col lg:flex-row">
        <main className="flex min-w-0 flex-1 flex-col">
          <POSHeader
            userName={pos.user?.name}
            searchTerm={pos.searchTerm}
            onSearch={pos.setSearchTerm}
            totalItems={pos.totalItems}
            onOpenCart={() => pos.setShowCart(true)}
            categories={pos.categoryList}
            selectedCategory={pos.selectedCategory}
            onSelectCategory={pos.setSelectedCategory}
          />

          <ScrollArea className="flex-1">
            <div className="px-4 py-4 gap-2 lg:px-6">
              <ProductGrid
                loading={pos.loading}
                parts={pos.visibleParts}
                onAdd={pos.addToCart}
              />
            </div>
          </ScrollArea>

          <POSFooter userName={pos.user?.name} />
        </main>

        <aside className="hidden w-[400px] shrink-0 flex-col border-l bg-background lg:flex">
          <CartPanel
            cart={pos.cart}
            totalItems={pos.totalItems}
            subtotal={pos.subtotal}
            vat={pos.vat}
            total={pos.total}
            saleProcessing={pos.saleProcessing}
            onClear={pos.clearCart}
            onRemove={pos.removeFromCart}
            onQty={pos.updateQty}
            onSell={pos.handleSell}
          />
        </aside>
      </div>

      <Sheet open={pos.showCart} onOpenChange={pos.setShowCart}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="border-b px-2 py-3">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Cart ({pos.totalItems})
            </SheetTitle>
          </SheetHeader>
          <CartPanel
            cart={pos.cart}
            totalItems={pos.totalItems}
            subtotal={pos.subtotal}
            vat={pos.vat}
            total={pos.total}
            saleProcessing={pos.saleProcessing}
            onClear={pos.clearCart}
            onRemove={pos.removeFromCart}
            onQty={pos.updateQty}
            onSell={pos.handleSell}
            hideHeader
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
