import api from "@/lib/api";

type NewUser = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export const createUser = async (user: NewUser) => {
  const response = await api.post("/users", user);
  return response.data;
};
