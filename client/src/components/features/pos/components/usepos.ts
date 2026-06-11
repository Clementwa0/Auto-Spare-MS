import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { fetchParts, updatePartQty } from "@/services/part";
import { createSale } from "@/services/sale";
import { fetchCategories } from "@/services/category";
import type { Part, Category } from "@/types/type";
import { useAuth } from "@/context/AuthContext";
import { printReceipt, downloadReceipt } from "@/lib/receipts";
import { ALL_PARTS, type CartItem } from "./types";

export function usePOS() {
  const { user } = useAuth();
  const [parts, setParts] = useState<Part[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saleProcessing, setSaleProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_PARTS);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [partsData, categoriesData] = await Promise.all([
          fetchParts(),
          fetchCategories(),
        ]);
        setParts(partsData);
        setCategories(categoriesData);
      } catch (err) {
        toast.error("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const visibleParts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const byCat = (p: Part) => {
      if (selectedCategory === ALL_PARTS) return true;
      const cat = categories.find((c) => c.name === selectedCategory);
      if (!cat) return true;
      const pid = typeof p.category === "string" ? p.category : p.category?._id;
      return pid === cat._id;
    };
    return parts.filter((p) => {
      const matchesQ =
        !q || `${p.description} ${p.part_no} ${p.code}`.toLowerCase().includes(q);
      return matchesQ && byCat(p);
    });
  }, [parts, searchTerm, selectedCategory, categories]);

  const addToCart = (part: Part) => {
    if (part.qty === 0) {
      toast.warning(`${part.description} is out of stock`);
      return;
    }
    const existing = cart.find((i) => i.part._id === part._id);
    if (existing) {
      if (existing.quantity + 1 > part.qty) {
        toast.warning(`Only ${part.qty} available in stock`);
        return;
      }
      setCart(
        cart.map((i) =>
          i.part._id === part._id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      setCart([...cart, { part, quantity: 1 }]);
    }
  };

  const updateQty = (id: string, qty: number) => {
    const item = cart.find((i) => i.part._id === id);
    if (!item) return;
    let next = qty;
    if (next > item.part.qty) {
      toast.warning(`Only ${item.part.qty} available in stock`);
      next = item.part.qty;
    }
    if (next < 1) next = 1;
    setCart((prev) =>
      prev.map((i) => (i.part._id === id ? { ...i, quantity: next } : i)),
    );
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => i.part._id !== id));

  const clearCart = () => {
    setCart([]);
    toast.info("Cart cleared");
  };

  const subtotal = cart.reduce(
    (s, i) => s + i.quantity * i.part.selling_price,
    0,
  );
  const vat = subtotal * 0.16;
  const total = subtotal + vat;
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  const handleSell = async () => {
    if (cart.length === 0) {
      toast.warning("Add items to cart first");
      return;
    }
    setSaleProcessing(true);
    try {
      const bad = cart.find((i) => i.quantity > i.part.qty);
      if (bad)
        throw new Error(
          `Insufficient stock for ${bad.part.description}. Available: ${bad.part.qty}`,
        );

      await createSale({
        items: cart.map((i) => ({
          part: i.part._id,
          qty: i.quantity,
          selling_price: i.part.selling_price,
          buying_price: i.part.buying_price,
        })),
        total,
        cashier: user?._id,
      });

      await Promise.all(
        cart.map((i) =>
          updatePartQty(i.part._id, { qty: i.part.qty - i.quantity }),
        ),
      );

      const saleId = `S-${Date.now().toString().slice(-8)}`;
      const receiptData = {
        items: cart,
        subtotal,
        vat,
        total,
        cashier: user?.name,
        terminal: "POS-001",
        saleId,
        date: new Date(),
      };

      printReceipt(receiptData);

      toast.success("Sale completed", {
        description: `Receipt ${saleId} sent to printer.`,
        action: {
          label: "Download",
          onClick: () => downloadReceipt(receiptData),
        },
      });

      setCart([]);
      setShowCart(false);
      const updated = await fetchParts();
      setParts(updated);
    } catch (e: any) {
      toast.error(e.message || "Sale failed. Please try again.");
      console.error(e);
    } finally {
      setSaleProcessing(false);
    }
  };

  const categoryList = [ALL_PARTS, ...categories.map((c) => c.name)];

  return {
    user,
    parts,
    visibleParts,
    cart,
    searchTerm,
    setSearchTerm,
    loading,
    saleProcessing,
    selectedCategory,
    setSelectedCategory,
    showCart,
    setShowCart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    subtotal,
    vat,
    total,
    totalItems,
    handleSell,
    categoryList,
  };
}
