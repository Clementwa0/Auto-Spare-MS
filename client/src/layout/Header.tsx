import { useNavigate, useLocation } from "react-router-dom";
import { Bell, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, company, branch, logout } = useAuth();

  const getPageTitle = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.length ? segments[segments.length - 1] : "Dashboard";
  };

  const title = getPageTitle(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between gap-4 px-4 md:px-6 h-16 border-b bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {company?.name || "No company"}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            Branch: {branch?.name || "—"}
          </div>
        </div>
      </div>

      <h1 className="hidden md:block text-lg font-semibold capitalize text-gray-800 dark:text-white">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="/assets/Admin.png" />
              <AvatarFallback>{(user?.name || user?.role || "?").slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/branch/setup")}>
              Manage branches
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
