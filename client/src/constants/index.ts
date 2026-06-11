import {
  Boxes,
  Truck,
  AlertTriangle,
  FileBarChart2,
  Settings,
  Package,
  Home,
  DollarSign,
} from "lucide-react";

export const links = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: Home,
    roles: ["admin", "sales"],
  },
  { name: "Parts", path: "/parts", icon: Package, roles: ["admin", "sales"] },
  { name: "Categories", path: "/categories", icon: Boxes, roles: ["admin"] },
  { name: "Suppliers", path: "/suppliers", icon: Truck, roles: ["admin"] },
  {
    name: "Low Stock",
    path: "/reports/low-stock",
    icon: AlertTriangle,
    roles: ["admin"],
  },
  { name: "Reports", path: "/reports", icon: FileBarChart2, roles: ["admin"] },
  { name: "POS", path: "/pos-sale", icon: DollarSign, roles: ["admin","sales"] },

  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["admin", "sales"],
  },
];

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface SparePart {
  _id: string;
  part_no: string;
  code: string;
  brand: string;
  description: string;
  qty: number;
  unit: string;
  buying_price: number;
  selling_price: number;
  category: Category;
  compatible_models: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  _id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}
