import api from "@/lib/api";

export type AuthUser = {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: "admin" | "sales" | "super-admin";
};

export type AuthCompany = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
} | null;

export type AuthBranch = {
  _id: string;
  name: string;
  company?: string;
  address?: string;
  phone?: string;
  isMainBranch?: boolean;
  isActive?: boolean;
} | null;

export type AuthResponse = {
  token: string;
  user: AuthUser;
  company: AuthCompany;
  branch: AuthBranch;
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  // Legacy bootstrap — backend auto-creates a default company + branch.
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

export const registerCompany = async (payload: {
  companyName: string;
  branchName: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}): Promise<AuthResponse> => {
  const response = await api.post("/auth/register-company", payload);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data as { user: AuthUser; company: AuthCompany; branch: AuthBranch };
};
