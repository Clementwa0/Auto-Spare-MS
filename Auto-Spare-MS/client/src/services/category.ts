import api from "@/lib/api"; // axios instance
import type { Category } from "@/types/type";

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data;
};

// Fetch a single category by ID
export const fetchCategoryById = async (id: string): Promise<Category> => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Create a new category
export const createCategory = async (data: { name: string }): Promise<Category> => {
  const response = await api.post("/categories", data);
  return response.data;
};

// Update a category by ID
export const updateCategory = async (
  id: string,
  data: { name: string }
): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, data);
  return response.data;
};

// Delete a category by ID
export const deleteCategory = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
