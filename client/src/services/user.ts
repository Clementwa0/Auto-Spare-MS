import api from "@/lib/api";

export type NewUser = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "sales";
};

export type AppUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
  branch: string | null;
  createdAt?: string;
};

// Backend returns { user } — unwrap so callers get the user object directly.
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

export const deleteUser = async (id: string): Promise<{ message: string; id: string }> => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
