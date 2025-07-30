export interface Part {
  _id: string;
  part_no: string;
  code: string;
  description: string;
  brand: string;
  unit: string;
  category: Category | string;
  compatible_models: string[];
  qty: number;
  buying_price: number;
  selling_price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
}
