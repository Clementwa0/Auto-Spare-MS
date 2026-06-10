import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { fetchParts, updatePartQty } from "@/services/part";
import { createSale } from "@/services/sale";
import type { Part } from "@/types/type";
import { useAuth } from "@/context/AuthContext";
import { Search, ShoppingCart, Trash2, User, Monitor } from "lucide-react";

interface CartItem {
  part: Part;
  quantity: number;
}

export default function POSPage() {
  const { user } = useAuth();
  const [parts, setParts] = useState<Part[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saleProcessing, setSaleProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Parts");
  const [showCart, setShowCart] = useState(false);

  const formatKES = (amount: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);

  useEffect(() => {
    const loadParts = async () => {
      try {
        const data = await fetchParts();
        setParts(data);
      } catch {
        toast.error("Failed to load parts");
      } finally {
        setLoading(false);
      }
    };
    loadParts();
  }, []);

  const filteredParts = parts.filter((p) =>
    `${p.description} ${p.part_no} ${p.code}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredPartsByCategory =
    selectedCategory === "All Parts"
      ? filteredParts
      : filteredParts.filter((part) => part.category === selectedCategory);

  const addToCart = (part: Part) => {
    if (part.qty === 0) {
      toast.warning("This item is out of stock");
      return;
    }
    if (cart.some((item) => item.part._id === part._id)) {
      toast.warning("Item already in cart");
      return;
    }
    setCart([...cart, { part, quantity: 1 }]);
    toast.success(`${part.description} added to cart`);
  };

  const updateQty = (id: string, qty: number) => {
    const item = cart.find((item) => item.part._id === id);
    if (!item) return;
    if (qty > item.part.qty) {
      toast.warning(`Only ${item.part.qty} available in stock`);
      qty = item.part.qty;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.part._id === id ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.part._id !== id));
    toast.info("Item removed from cart");
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.quantity * item.part.selling_price,
    0
  );

  const handleSell = async () => {
    if (cart.length === 0) {
      toast.warning("Add items to cart first");
      return;
    }

    setSaleProcessing(true);

    try {
      const insufficientStock = cart.find(
        (item) => item.quantity > item.part.qty
      );
      if (insufficientStock) {
        throw new Error(
          `Insufficient stock for ${insufficientStock.part.description}`
        );
      }
      
      await createSale({
        items: cart.map((item) => ({
          part: item.part._id,
          qty: item.quantity,
          selling_price: item.part.selling_price,
          buying_price: item.part.buying_price, // Optional, if available
        })),
      });

      await Promise.all(
        cart.map((item) => {
          const newQty = item.part.qty - item.quantity;
          return updatePartQty(item.part._id, { qty: newQty });
        })
      );

      toast.success("Sale completed successfully!");
      setCart([]);
      const updatedParts = await fetchParts();
      setParts(updatedParts);
    } catch (err: any) {
      toast.error(err.message || "Sale failed. Please try again.");
    } finally {
      setSaleProcessing(false);
    }
  };

  const categories = [
    "All Parts",
    "Engine",
    "Brakes",
    "Electrical",
    "Suspension",
    "Exhaust",
    "Filters",
  ];

  return (
    <div className="flex flex-col h-screen bg-background p-2">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="p-1  bg-card border-b border-border">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 text-base"
                />
              </div>
              <Button
                variant="destructive"
                onClick={() => setSearchTerm("")}
                className="h-10 px-6"
              >
                Clear
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 bg-muted/30">
            {loading ? (
              <div className="flex justify-center items-center h-full"></div>
            ) : filteredPartsByCategory.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <ShoppingCart className="mx-auto mb-2 h-12 w-12" />
                <p>No parts found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {filteredPartsByCategory.map((part) => (
                  <Card key={part._id} className="fade-in">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold line-clamp-2">
                        {part.description}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Part #: {part.part_no}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Code: {part.code}
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          part.qty === 0
                            ? "text-destructive"
                            : part.qty <= 5
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {part.qty === 0
                          ? "OUT OF STOCK"
                          : `${part.qty} in stock`}
                      </p>
                      <p className="text-md font-bold text-primary">
                        {formatKES(part.selling_price)}
                      </p>
                      <Button
                        onClick={() => addToCart(part)}
                        disabled={part.qty === 0}
                        className="w-full"
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Floating Cart Icon */}
        <div className=" fixed bottom-20 right-4 md:right-4 z-50">
          <Button
            onClick={() => setShowCart(true)}
            className="relative rounded-full p-4 shadow-lg bg-primary text-white"
          >
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-white text-[10px] px-1.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Button>
        </div>
      </div>
      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="w-full sm:w-[50%] md:w-[40%] lg:w-[30%] h-full bg-white dark:bg-background p-4 shadow-xl overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Cart Summary</h2>
              <Button variant="ghost" onClick={() => setShowCart(false)}>
                Close
              </Button>
            </div>

            {cart.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center mt-10">
                Your cart is empty.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Remove</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.part._id}>
                      <TableCell className="text-xs">
                        {item.part.description}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={1}
                          max={item.part.qty}
                          value={item.quantity}
                          onChange={(e) =>
                            updateQty(item.part._id, parseInt(e.target.value))
                          }
                          className="w-16"
                        />
                      </TableCell>
                      <TableCell>
                        {formatKES(item.quantity * item.part.selling_price)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => removeFromCart(item.part._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="mt-auto space-y-3">
                <div className="text-right font-semibold text-lg">
                  Total: {formatKES(totalAmount)}
                </div>
                <Button
                  onClick={handleSell}
                  disabled={saleProcessing}
                  className="w-full"
                >
                  {saleProcessing ? "Processing..." : "Complete Sale"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-800 text-white text-xs p-2 flex justify-between">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          Operator: {user?.name}
        </div>
        <div className="flex items-center gap-1">
          <Monitor className="h-3 w-3" />
          Terminal: POS-001
        </div>
        <div>Version 2.3.1</div>
      </div>
    </div>
  );
}
