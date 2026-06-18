// Import React hooks
import { useEffect, useState } from "react";

// Import UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Import icons
import { Plus, Edit, Trash2, Boxes, Search, Loader2 } from "lucide-react";

// Import notifications
import { toast } from "sonner";

// Import API service functions
import {
  fetchCategories,
  createCategory,
  deleteCategory,
} from "@/services/category";
import { fetchParts } from "@/services/part";

// Import types
import type { Category, Part } from "@/types/type";

export default function Categories() {
  // ----------------- STATE -----------------
  const [categories, setCategories] = useState<Category[]>([]); // Stores categories
  const [parts, setParts] = useState<Part[]>([]); // Stores parts
  const [searchTerm, setSearchTerm] = useState(""); // For filtering categories
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Add category dialog toggle
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false); // Mobile drawer toggle
  const [newCategoryName, setNewCategoryName] = useState(""); // Input value for new category
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Mobile detection
  const [loading, setLoading] = useState(true); // Loading state

  // ----------------- EFFECT: Resize listener -----------------
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ----------------- EFFECT: Fetch categories + parts -----------------
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch categories & parts in parallel
        const [catData, partData] = await Promise.all([
          fetchCategories(),
          fetchParts(),
        ]);
        setCategories(catData);
        setParts(partData);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ----------------- HELPERS -----------------
  // Filter categories by search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get parts for a category
  const getPartsForCategory = (categoryId: string) =>
    parts.filter(
      (p) => typeof p.category !== "string" && p.category._id === categoryId
    );

  // Count parts in a category
  const getPartsCount = (categoryId: string) =>
    getPartsForCategory(categoryId).length;

  // Calculate total value of a category
  const getTotalValue = (categoryId: string) =>
    getPartsForCategory(categoryId).reduce(
      (sum, p) => sum + p.qty * p.buying_price,
      0
    );

  // ----------------- HANDLERS -----------------
  // Add new category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCat = await createCategory({ name: newCategoryName });
      setCategories((prev) => [...prev, newCat]);
      toast.success(`Category "${newCategoryName}" added successfully!`);
    } catch {
      toast.error("Failed to add category");
    }
    setNewCategoryName("");
    setIsDialogOpen(false);
  };

  // Delete category
  const handleDeleteCategory = async (id: string, name: string) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success(`"${name}" has been deleted`);
    } catch {
      toast.error("Failed to delete category");
    }
  };

  // ----------------- COMPONENT: Mobile Category Card -----------------
  const MobileCategoryCard = ({ category }: { category: Category }) => {
    const count = getPartsCount(category._id);
    const totalValue = getTotalValue(category._id);

    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex justify-between items-center">
            <span className="truncate mr-2">{category.name}</span>
            <Badge variant={count > 0 ? "default" : "secondary"}>
              {count} parts
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Value:</span>
              <span className="font-medium">
                KES {totalValue.toLocaleString()}
              </span>
            </div>
            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-destructive"
                disabled={count > 0} // Disable delete if category has parts
                onClick={() =>
                  handleDeleteCategory(category._id, category.name)
                }
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ----------------- MAIN RETURN -----------------
  return (
    <div className="space-y-6 p-4">
      {/* ----------------- Header ----------------- */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Organize your spare parts into categories
          </p>
        </div>

        {/* ----------------- Add Category Button ----------------- */}
        {isMobile ? (
          // Mobile Drawer for adding category
          <Drawer open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
            <DrawerTrigger asChild>
              <Button className="flex items-center gap-2 sm:w-auto">
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Categories Menu</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                {/* Add Category Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2 w-full mb-4">
                      <Plus className="h-4 w-4" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddCategory} className="space-y-4">
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Add Category</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Search input for mobile */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search categories..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          // Desktop Dialog for adding category
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Category</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* ----------------- Search (Desktop only) ----------------- */}
      {!isMobile && (
        <div className="flex gap-4 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ----------------- Loading State ----------------- */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-600" />
            <p className="mt-2 text-gray-600">Loading categories...</p>
          </div>
        </div>
      ) : (
        <>
          {/* ----------------- Mobile Category List ----------------- */}
          {isMobile ? (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Boxes className="h-5 w-5" />
                All Categories ({filteredCategories.length})
              </h2>

              {/* Empty state */}
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No categories found
                </div>
              ) : (
                <div className="pb-4">
                  {filteredCategories.map((category) => (
                    <MobileCategoryCard
                      key={category._id}
                      category={category}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            // ----------------- Desktop Category Table -----------------
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Boxes className="h-5 w-5" />
                  All Categories ({filteredCategories.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Parts Count</TableHead>
                        <TableHead>Total Value</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCategories.map((category) => {
                        const count = getPartsCount(category._id);
                        const totalValue = getTotalValue(category._id);

                        return (
                          <TableRow key={category._id}>
                            <TableCell className="font-medium">
                              {category.name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={count > 0 ? "default" : "secondary"}
                              >
                                {count} parts
                              </Badge>
                            </TableCell>
                            <TableCell>
                              KES {totalValue.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive"
                                  disabled={count > 0}
                                  onClick={() =>
                                    handleDeleteCategory(
                                      category._id,
                                      category.name
                                    )
                                  }
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
