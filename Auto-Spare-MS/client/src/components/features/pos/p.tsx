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
import {
  Search,
  ShoppingCart,
  Trash2,
  Clock,
  User,
  Monitor,
} from "lucide-react";

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

      await Promise.all(
        cart.map((item) => {
          const newQty = item.part.qty - item.quantity;
          return updatePartQty(item.part._id, { qty: newQty });
        })
      );

      await Promise.all(
        cart.map((item) =>
          createSale({ partId: item.part._id, quantity: item.quantity })
        )
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
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="pos-header px-6 py-4 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="fade-in">
            <h1 className="text-3xl font-bold text-white">AutoParts Pro</h1>
            <p className="text-primary-foreground/80">Point of Sale System</p>
          </div>
          <div className="flex items-center space-x-6 text-primary-foreground/90">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <div className="text-right">
                <p className="text-sm font-medium">
                  {new Date().toLocaleDateString()}
                </p>
                <p className="text-xs">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 flex flex-col pos-sidebar">
          <div className="p-6 bg-card border-b border-border">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
                className="h-12 px-6"
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

          <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
            {loading ? (
              <div className="flex justify-center items-center h-full"></div>
            ) : filteredPartsByCategory.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <ShoppingCart className="mx-auto mb-2 h-12 w-12" />
                <p>No parts found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPartsByCategory.map((part) => (
                  <Card key={part._id} className="fade-in">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-2">
                        {part.description}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
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
                      <p className="text-xl font-bold text-primary">
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

        {/* Right Panel - Cart */}
        <div className="w-96 flex flex-col bg-card border-l border-border">
          <Card className="flex-1 flex flex-col rounded-none border-0">
            <CardHeader className="bg-primary text-white py-4">
              <CardTitle className="text-xl flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Current Sale
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {cart.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <ShoppingCart className="mx-auto mb-2 h-12 w-12" />
                  <p>Cart is empty</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.part._id}>
                        <TableCell>
                          <p className="text-sm font-medium">
                            {item.part.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.part.part_no}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            max={item.part.qty}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQty(
                                item.part._id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 text-center text-sm h-8"
                          />
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {formatKES(item.part.selling_price)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatKES(item.quantity * item.part.selling_price)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.part._id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Cart Summary */}
          
        </div>
      </div>

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
