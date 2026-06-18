import api from "@/lib/api";
import type { Role } from "@/services/auth";

export type AppUser = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  branch?: { _id: string; name: string } | string | null;
  activeBranch?: { _id: string; name: string } | string | null;
  branches?: ({ _id: string; name: string } | string)[];
  isActive?: boolean;
  createdAt?: string;
};

type NewUser = {
  name: string;
  email: string;
  password: string;
  role: Role | string;
  branchIds?: string[];
  activeBranchId?: string;
};

export const createUser = async (user: NewUser): Promise<AppUser> => {
  const response = await api.post("/users", user);
  return response.data.user;
};

export const listUsers = async (): Promise<AppUser[]> => {
  const response = await api.get("/users");
  return response.data.users;
};

export const getUser = async (id: string): Promise<AppUser> => {
  const response = await api.get(`/users/${id}`);
  return response.data.user;
};

export const updateUser = async (
  id: string,
  data: Partial<NewUser> & { isActive?: boolean }
): Promise<AppUser> => {
  const response = await api.put(`/users/${id}`, data);
  return response.data.user;
};

export const deleteUser = async (id: string): Promise<{ message: string; id: string }> => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
