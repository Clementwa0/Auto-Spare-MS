import api from "@/lib/api";

export type Branch = {
  _id: string;
  name: string;
  company?: string;
  address?: string;
  location?: string;
  phone?: string;
  isMainBranch?: boolean;
  isActive?: boolean;
  admin?: string;
  createdAt?: string;
};

export const listBranches = async (): Promise<Branch[]> => {
  const res = await api.get("/branches");
  return res.data.branches;
};

export const createBranch = async (data: {
  name: string;
  address?: string;
  location?: string;
  phone?: string;
  isMainBranch?: boolean;
}): Promise<Branch> => {
  const res = await api.post("/branches", data);
  return res.data.branch;
};

export const getBranch = async (id: string): Promise<Branch> => {
  const res = await api.get(`/branches/${id}`);
  return res.data.branch;
};

export const updateBranch = async (id: string, data: Partial<Branch>): Promise<Branch> => {
  const res = await api.put(`/branches/${id}`, data);
  return res.data.branch;
};

export const disableBranch = async (id: string): Promise<Branch> => {
  const res = await api.patch(`/branches/${id}/disable`);
  return res.data.branch;
};

export const assignUserToBranch = async (branchId: string, userId: string) => {
  const res = await api.post(`/branches/${branchId}/assign-user`, { userId });
  return res.data.user;
};

