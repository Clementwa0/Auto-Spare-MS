import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LucideMenu, SidebarClose, SidebarOpen } from "lucide-react";

import { links } from "@/constants";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

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
            <ul className="space-y-2 text-sm w-50 text-gray-800 dark:text-white">
              {links.map(({ path, name, icon: Icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      location.pathname === path
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block dark:bg-gray-900 ">
        <aside
          className={cn(
            "h-screen border-r shadow-lg flex flex-col transition-all duration-300 bg-white dark:bg-gray-900",
            collapsed ? "w-14" : "w-64"
          )}
        >
          <div className="flex items-center justify-between border px-4 md:px-6 h-16 border-b bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
            {!collapsed && (
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                JT
              </span>
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

          <nav className="flex-1 px-2 py-4">
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {links.map(({ path, name, icon: Icon }) => (
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
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default Sidebar;
