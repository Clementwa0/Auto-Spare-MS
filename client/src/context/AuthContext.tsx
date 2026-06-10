import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  registerCompany as apiRegisterCompany,
  getMe,
  type AuthUser,
  type AuthCompany,
  type AuthBranch,
} from "@/services/auth";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  company: AuthCompany;
  branch: AuthBranch;
  branchId: string | null;
  companyId: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  registerCompany: (payload: {
    companyName: string;
    branchName: string;
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  token: "token",
  user: "user",
  company: "company",
  branch: "branch",
};

const persist = (token: string, user: AuthUser, company: AuthCompany, branch: AuthBranch) => {
  localStorage.setItem(STORAGE_KEYS.token, token);
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  if (company) localStorage.setItem(STORAGE_KEYS.company, JSON.stringify(company));
  else localStorage.removeItem(STORAGE_KEYS.company);
  if (branch) localStorage.setItem(STORAGE_KEYS.branch, JSON.stringify(branch));
  else localStorage.removeItem(STORAGE_KEYS.branch);
};

const readJSON = <T,>(key: string): T | null => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEYS.token));
  const [user, setUser] = useState<AuthUser | null>(() => readJSON<AuthUser>(STORAGE_KEYS.user));
  const [company, setCompany] = useState<AuthCompany>(() => readJSON<AuthCompany>(STORAGE_KEYS.company));
  const [branch, setBranch] = useState<AuthBranch>(() => readJSON<AuthBranch>(STORAGE_KEYS.branch));

  const apply = (data: { token: string; user: AuthUser; company: AuthCompany; branch: AuthBranch }) => {
    setToken(data.token);
    setUser(data.user);
    setCompany(data.company);
    setBranch(data.branch);
    persist(data.token, data.user, data.company, data.branch);
  };

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    apply(data);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await registerUser(name, email, password);
    apply(data);
  };

  const registerCompany: AuthContextType["registerCompany"] = async (payload) => {
    const data = await apiRegisterCompany(payload);
    apply(data);
  };

  const refreshUser = async () => {
    if (!token) return;
    const data = await getMe();
    setUser(data.user);
    setCompany(data.company);
    setBranch(data.branch);
    persist(token, data.user, data.company, data.branch);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCompany(null);
    setBranch(null);
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    // legacy keys
    localStorage.removeItem("branchId");
  };

  useEffect(() => {
    if (token && user && (!company || !branch)) {
      refreshUser().catch(() => {/* keep cached state */});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        company,
        branch,
        branchId: branch?._id || null,
        companyId: company?._id || null,
        login,
        register,
        registerCompany,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext missing");
  return ctx;
};
