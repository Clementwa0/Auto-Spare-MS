import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  registerCompany as apiRegisterCompany,
  switchBranch as apiSwitchBranch,
  getMe,
  type AuthUser,
  type AuthCompany,
  type AuthBranch,
  type AuthResponse,
} from "@/services/auth";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  company: AuthCompany;
  branch: AuthBranch;           // active branch (legacy alias)
  activeBranch: AuthBranch;
  branches: NonNullable<AuthBranch>[];
  branchId: string | null;       // active branch id
  activeBranchId: string | null;
  companyId: string | null;
  needsBranchSelection: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string) => Promise<AuthResponse>;
  registerCompany: (payload: {
    companyName: string;
    branchName: string;
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthResponse>;
  switchBranch: (branchId: string) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  token: "token",
  user: "user",
  company: "company",
  branch: "branch",
  branches: "branches",
  activeBranchId: "activeBranchId",
};

const persist = (
  token: string | null,
  user: AuthUser | null,
  company: AuthCompany,
  branch: AuthBranch,
  branches: NonNullable<AuthBranch>[],
  activeBranchId: string | null
) => {
  if (token) localStorage.setItem(STORAGE_KEYS.token, token);
  if (user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  if (company) localStorage.setItem(STORAGE_KEYS.company, JSON.stringify(company));
  else localStorage.removeItem(STORAGE_KEYS.company);
  if (branch) localStorage.setItem(STORAGE_KEYS.branch, JSON.stringify(branch));
  else localStorage.removeItem(STORAGE_KEYS.branch);
  localStorage.setItem(STORAGE_KEYS.branches, JSON.stringify(branches || []));
  if (activeBranchId) localStorage.setItem(STORAGE_KEYS.activeBranchId, activeBranchId);
  else localStorage.removeItem(STORAGE_KEYS.activeBranchId);
};

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEYS.token));
  const [user, setUser] = useState<AuthUser | null>(() => readJSON<AuthUser | null>(STORAGE_KEYS.user, null));
  const [company, setCompany] = useState<AuthCompany>(() => readJSON<AuthCompany>(STORAGE_KEYS.company, null));
  const [branch, setBranch] = useState<AuthBranch>(() => readJSON<AuthBranch>(STORAGE_KEYS.branch, null));
  const [branches, setBranches] = useState<NonNullable<AuthBranch>[]>(() =>
    readJSON<NonNullable<AuthBranch>[]>(STORAGE_KEYS.branches, [])
  );
  const [activeBranchId, setActiveBranchId] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEYS.activeBranchId)
  );
  const [needsBranchSelection, setNeedsBranchSelection] = useState(false);

  const apply = (data: AuthResponse | (Omit<AuthResponse, "token"> & { token?: string })) => {
    const nextToken = "token" in data && data.token ? data.token : token;
    setToken(nextToken);
    setUser(data.user);
    setCompany(data.company);
    setBranch(data.activeBranch || data.branch || null);
    setBranches(data.branches || []);
    setActiveBranchId(data.activeBranchId || null);
    setNeedsBranchSelection(!!data.needsBranchSelection);
    persist(
      nextToken,
      data.user,
      data.company,
      data.activeBranch || data.branch || null,
      data.branches || [],
      data.activeBranchId || null
    );
  };

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    apply(data);
    return data;
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await registerUser(name, email, password);
    apply(data);
    return data;
  };

  const registerCompany: AuthContextType["registerCompany"] = async (payload) => {
    const data = await apiRegisterCompany(payload);
    apply(data);
    return data;
  };

  const switchBranch = async (branchId: string) => {
    const data = await apiSwitchBranch(branchId);
    apply(data);
    return data;
  };

  const refreshUser = async () => {
    if (!token) return;
    const data = await getMe();
    apply(data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCompany(null);
    setBranch(null);
    setBranches([]);
    setActiveBranchId(null);
    setNeedsBranchSelection(false);
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem("branchId");
  };

  useEffect(() => {
    if (token && user && branches.length === 0) {
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
        activeBranch: branch,
        branches,
        branchId: activeBranchId,
        activeBranchId,
        companyId: company?._id || null,
        needsBranchSelection,
        login,
        register,
        registerCompany,
        switchBranch,
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

// CompanyProvider alias for spec compatibility. AuthContext IS the company
// context — it holds both the company and the branch list.
export const CompanyProvider = AuthProvider;
export const useCompany = () => {
  const { company, companyId } = useAuth();
  return { company, companyId };
};
