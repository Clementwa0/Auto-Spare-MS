import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LucideMenu, SidebarClose, SidebarOpen, X, Building2 } from "lucide-react";
import { links } from "@/constants";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, company, branch } = useAuth();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const filteredLinks = links.filter((link) => link.roles.includes(user?.role || ""));

  const TenantBlock = ({ compact = false }: { compact?: boolean }) => (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700",
        compact && "justify-center"
      )}
    >
      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
      {!compact && (
        <div className="min-w-0">
          <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">
            {company?.name || "No company"}
          </div>
          <div className="text-[11px] text-muted-foreground truncate">
            {branch?.name || "No branch"}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {isMobile && (
        <div className="fixed top-0 left-4 z-50 bg-white dark:bg-gray-900 p-2">
          <Button
            onClick={toggleMenu}
            className="h-10 w-10 shadow-none border-none text-gray-900 dark:text-white"
            variant="ghost"
          >
            {menuOpen ? <X /> : <LucideMenu className="w-10 h-10" />}
          </Button>
        </div>
      )}

      {isMobile && menuOpen && (
        <div className="fixed inset-0 z-40 w-60 bg-white dark:bg-gray-900 bg-opacity-95 p-4 pt-16">
          <div className="mb-4">
            <TenantBlock />
          </div>
          <nav>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {filteredLinks.map(({ path, name, icon: Icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      location.pathname === path
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-100 dark:hover:bg-gray-800"
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{name}</span>
                  </Link>
                </li>
              ))}
              {user?.role === "admin" && (
                <>
                  <li>
                    <Link
                      to="/branch/setup"
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-gray-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Building2 className="w-5 h-5" /> <span>Branches</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/users/create"
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-gray-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="w-5 h-5 flex items-center justify-center font-bold">+</span>
                      <span>Create User</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}

      <div className="hidden md:block dark:bg-gray-900">
        <aside
          className={cn(
            "h-screen border-r shadow-lg flex flex-col transition-all duration-300 bg-white dark:bg-gray-900",
            collapsed ? "w-14" : "w-57"
          )}
        >
          <div className="flex items-center justify-between border px-4 md:px-6 h-16 border-b bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
            {!collapsed && (
              <span className="text-xl font-bold text-gray-800 dark:text-white">JT</span>
            )}
            <Button
              onClick={() => setCollapsed((prev) => !prev)}
              size="icon"
              variant="ghost"
              className="text-gray-700 dark:text-white"
            >
              {collapsed ? <SidebarOpen /> : <SidebarClose />}
            </Button>
          </div>

          <div className="px-2 pt-3">
            <TenantBlock compact={collapsed} />
          </div>

          <nav className="flex-1 px-2 py-4 flex flex-col justify-between">
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {filteredLinks.map(({ path, name, icon: Icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      location.pathname === path
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-100 dark:hover:bg-gray-800",
                      collapsed && "justify-center"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {!collapsed && <span>{name}</span>}
                  </Link>
                </li>
              ))}
            </ul>

            {user?.role === "admin" && (
              <ul className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>
                  <Link
                    to="/branch/setup"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      location.pathname === "/branch/setup"
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-100 dark:hover:bg-gray-800",
                      collapsed && "justify-center"
                    )}
                  >
                    <Building2 className="w-5 h-5" />
                    {!collapsed && <span>Branches</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/users/create"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      location.pathname === "/users/create"
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-100 dark:hover:bg-gray-800",
                      collapsed && "justify-center"
                    )}
                  >
                    <span className="w-5 h-5 flex items-center justify-center font-bold">+</span>
                    {!collapsed && <span>Create User</span>}
                  </Link>
                </li>
              </ul>
            )}
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default Sidebar;
