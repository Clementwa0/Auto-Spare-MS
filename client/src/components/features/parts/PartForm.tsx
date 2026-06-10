import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createPart } from "@/services/part";
import { fetchCategories } from "@/services/category";
import type { Category } from "@/types/type";

export default function PartForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    part_no: "",
    code: "",
    brand: "",
    description: "",
    compatible_models: "",
    qty: 0,
    unit: "",
    buying_price: 0,
    selling_price: 0,
    category: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "qty" || name.includes("price") ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        compatible_models: form.compatible_models.split(",").map((m) => m.trim()),
      };
      await createPart(payload);
      toast.success("Part added successfully!");
      setForm({
        part_no: "",
        code: "",
        brand: "",
        description: "",
        compatible_models: "",
        qty: 0,
        unit: "",
        buying_price: 0,
        selling_price: 0,
        category: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to add part");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md w-full">
      <CardHeader>
        <CardTitle>Add New Part</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Input name="part_no" placeholder="Part No" required value={form.part_no} onChange={handleChange} />
            <Input name="code" placeholder="Code" required value={form.code} onChange={handleChange} />
            <Input name="brand" placeholder="Brand" required value={form.brand} onChange={handleChange} />
            <Input name="description" placeholder="Description" required value={form.description} onChange={handleChange} />
            <Input
              name="compatible_models"
              placeholder="Compatible Models (comma-separated)"
              required
              value={form.compatible_models}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-3">
            <Input
              name="qty"
              type="number"
              placeholder="Quantity"
              required
              value={form.qty}
              onChange={handleChange}
            />
            <Input name="unit" placeholder="Unit (e.g. pcs)" required value={form.unit} onChange={handleChange} />
            <Input
              name="buying_price"
              type="number"
              placeholder="Buying Price"
              required
              value={form.buying_price}
              onChange={handleChange}
            />
            <Input
              name="selling_price"
              type="number"
              placeholder="Selling Price"
              required
              value={form.selling_price}
              onChange={handleChange}
            />
            <div>
              <Label>Category</Label>
              <select
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded px-2 py-2"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add New Part"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
