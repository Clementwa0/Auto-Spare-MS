import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LucideMenu, SidebarClose, SidebarOpen } from "lucide-react";
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
  const { user } = useAuth();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const filteredLinks = links.filter(link => link.roles.includes(user?.role || ""));

  return (
    <div>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <div className="fixed top-0 left-4 z-50 bg-white dark:bg-gray-900 p-2 rounded-md shadow-md">
          <Button
            onClick={toggleMenu}
            className="h-10 w-10 text-gray-900 dark:text-white"
            variant="ghost"
          >
            {menuOpen ? <SidebarClose /> : <LucideMenu />}
          </Button>
        </div>
      )}

      {/* Mobile Sidebar Drawer */}
      {isMobile && menuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-gray-900 bg-opacity-95 p-4 pt-16">
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
                <li>
                  <Link
                    to="/users/create"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      location.pathname === "/users/create"
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-100 dark:hover:bg-gray-800"
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="w-5 h-5 flex items-center justify-center font-bold">+</span>
                    <span>Create User</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block dark:bg-gray-900">
        <aside
          className={cn(
            "h-screen border-r shadow-lg flex flex-col transition-all duration-300 bg-white dark:bg-gray-900",
            collapsed ? "w-14" : "w-64"
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
              <ul className="mt-4 text-sm text-gray-700 dark:text-gray-300">
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
