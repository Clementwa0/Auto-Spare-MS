import {
  LayoutDashboard,
  PackageSearch,
  PlusCircle,
  Boxes,
  Truck,
  AlertTriangle,
  FileBarChart2,
  Settings
} from "lucide-react";

export const links = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Parts", path: "/parts", icon: PackageSearch },
  { name: "Add Part", path: "/parts/new", icon: PlusCircle },
  { name: "Categories", path: "/categories", icon: Boxes },
  { name: "Suppliers", path: "/suppliers", icon: Truck },
  { name: "Low Stock", path: "/reports/low-stock", icon: AlertTriangle },
  { name: "Reports", path: "/reports", icon: FileBarChart2 },
  { name: "Settings", path: "/settings", icon: Settings },
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

export const dummyCategories: Category[] = [
  {
    _id: "1",
    name: "Engine Parts",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    _id: "2",
    name: "Brake System",
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },
  {
    _id: "3",
    name: "Suspension",
    createdAt: "2024-01-17T11:00:00Z",
    updatedAt: "2024-01-17T11:00:00Z",
  },
  {
    _id: "4",
    name: "Electrical",
    createdAt: "2024-01-18T12:00:00Z",
    updatedAt: "2024-01-18T12:00:00Z",
  },
  {
    _id: "5",
    name: "Transmission",
    createdAt: "2024-01-19T13:00:00Z",
    updatedAt: "2024-01-19T13:00:00Z",
  },
];

export const dummySpareParts: SparePart[] = [
  {
    _id: "1",
    part_no: "EP001",
    code: "AIR-FILTER-001",
    brand: "Bosch",
    description: "Air Filter for Honda Civic",
    qty: 25,
    unit: "PCS",
    buying_price: 45.00,
    selling_price: 65.00,
    category: dummyCategories[0],
    compatible_models: ["Honda Civic 2018-2023", "Honda Accord 2019-2023"],
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-01-20T09:00:00Z",
  },
  {
    _id: "2",
    part_no: "BP001",
    code: "BRAKE-PAD-001",
    brand: "Brembo",
    description: "Front Brake Pads Set",
    qty: 8,
    unit: "SET",
    buying_price: 120.00,
    selling_price: 180.00,
    category: dummyCategories[1],
    compatible_models: ["Toyota Camry 2015-2023", "Toyota Corolla 2014-2023"],
    createdAt: "2024-01-21T10:00:00Z",
    updatedAt: "2024-01-21T10:00:00Z",
  },
  {
    _id: "3",
    part_no: "SP001",
    code: "SHOCK-ABS-001",
    brand: "Monroe",
    description: "Rear Shock Absorber",
    qty: 12,
    unit: "PCS",
    buying_price: 85.00,
    selling_price: 125.00,
    category: dummyCategories[2],
    compatible_models: ["Ford Focus 2012-2020", "Ford Fiesta 2011-2019"],
    createdAt: "2024-01-22T11:00:00Z",
    updatedAt: "2024-01-22T11:00:00Z",
  },
  {
    _id: "4",
    part_no: "EL001",
    code: "SPARK-PLUG-001",
    brand: "NGK",
    description: "Iridium Spark Plugs (Set of 4)",
    qty: 35,
    unit: "SET",
    buying_price: 32.00,
    selling_price: 48.00,
    category: dummyCategories[3],
    compatible_models: ["BMW 3 Series 2012-2019", "BMW X3 2011-2018"],
    createdAt: "2024-01-23T12:00:00Z",
    updatedAt: "2024-01-23T12:00:00Z",
  },
  {
    _id: "5",
    part_no: "TR001",
    code: "CLUTCH-KIT-001",
    brand: "LuK",
    description: "Complete Clutch Kit",
    qty: 3,
    unit: "KIT",
    buying_price: 280.00,
    selling_price: 420.00,
    category: dummyCategories[4],
    compatible_models: ["Volkswagen Golf 2015-2022", "Audi A3 2014-2021"],
    createdAt: "2024-01-24T13:00:00Z",
    updatedAt: "2024-01-24T13:00:00Z",
  },
  {
    _id: "6",
    part_no: "EP002",
    code: "OIL-FILTER-001",
    brand: "Mann",
    description: "Engine Oil Filter",
    qty: 45,
    unit: "PCS",
    buying_price: 15.00,
    selling_price: 25.00,
    category: dummyCategories[0],
    compatible_models: ["Mercedes C-Class 2014-2022", "Mercedes E-Class 2016-2023"],
    createdAt: "2024-01-25T14:00:00Z",
    updatedAt: "2024-01-25T14:00:00Z",
  },
  {
    _id: "7",
    part_no: "BP002",
    code: "BRAKE-DISC-001",
    brand: "ATE",
    description: "Front Brake Disc (Pair)",
    qty: 6,
    unit: "PAIR",
    buying_price: 95.00,
    selling_price: 140.00,
    category: dummyCategories[1],
    compatible_models: ["Nissan Altima 2013-2020", "Nissan Sentra 2012-2019"],
    createdAt: "2024-01-26T15:00:00Z",
    updatedAt: "2024-01-26T15:00:00Z",
  },
  {
    _id: "8",
    part_no: "EL002",
    code: "BATTERY-001",
    brand: "Optima",
    description: "12V Car Battery 70Ah",
    qty: 2,
    unit: "PCS",
    buying_price: 180.00,
    selling_price: 260.00,
    category: dummyCategories[3],
    compatible_models: ["Hyundai Elantra 2011-2020", "Kia Forte 2014-2021"],
    createdAt: "2024-01-27T16:00:00Z",
    updatedAt: "2024-01-27T16:00:00Z",
  },
];

export const dummySuppliers: Supplier[] = [
  {
    _id: "1",
    name: "AutoParts Pro Ltd",
    contact: "John Smith",
    email: "john@autopartspro.com",
    address: "123 Industrial Ave, City Center",
    phone: "+1-555-0123",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-10T09:00:00Z",
  },
  {
    _id: "2",
    name: "European Motors Supply",
    contact: "Maria Garcia",
    email: "maria@europeanmotors.com",
    address: "456 Business Park Rd, Downtown",
    phone: "+1-555-0456",
    createdAt: "2024-01-11T10:00:00Z",
    updatedAt: "2024-01-11T10:00:00Z",
  },
  {
    _id: "3",
    name: "Global Parts Distribution",
    contact: "David Chen",
    email: "david@globalparts.com",
    address: "789 Commerce St, Tech District",
    phone: "+1-555-0789",
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-12T11:00:00Z",
  },
  {
    _id: "4",
    name: "Premium Auto Components",
    contact: "Sarah Johnson",
    email: "sarah@premiumauto.com",
    address: "321 Export Blvd, Port Area",
    phone: "+1-555-0321",
    createdAt: "2024-01-13T12:00:00Z",
    updatedAt: "2024-01-13T12:00:00Z",
  },
];

// Helper function to get low stock items (qty < 10)
export const getLowStockItems = () => {
  return dummySpareParts.filter(part => part.qty < 10);
};

// Helper function to calculate total inventory value
export const getTotalInventoryValue = () => {
  return dummySpareParts.reduce((total, part) => {
    return total + (part.qty * part.buying_price);
  }, 0);
};

// Helper function to get recent parts (last 7 added)
export const getRecentParts = () => {
  return dummySpareParts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 7);
};