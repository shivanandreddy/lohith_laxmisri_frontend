
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const items = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Projects", path: "/projects", icon: FolderKanban },
  { name: "Products", path: "/products", icon: Package },
  { name: "Tasks", path: "/tasks", icon: CheckSquare },
  { name: "Reports", path: "/reports", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({
  collapsed,
  mobileOpen,
  onClose,
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col
        border-r border-slate-200 bg-white transition-all duration-200
        dark:border-slate-800 dark:bg-slate-950
        ${collapsed ? "lg:w-16" : "lg:w-64"}
        w-64
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      {/* Sidebar Header */}
      <div
        className="flex h-16 shrink-0 items-center gap-3 overflow-hidden
          border-b border-slate-200 px-5 dark:border-slate-800"
      >
        <LayoutDashboard
          className="shrink-0 text-blue-600"
          size={24}
        />

        <span
          className={`whitespace-nowrap font-bold text-slate-900
            dark:text-white ${collapsed ? "lg:hidden" : ""}`}
        >
          WorkSpace
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            onClick={onClose}
            title={collapsed ? name : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-3
                text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
            }
          >
            <Icon size={20} className="shrink-0" />

            <span className={collapsed ? "lg:hidden" : ""}>
              {name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Logout at Bottom */}
      <div className="shrink-0 border-t border-slate-200 p-3 dark:border-slate-800">
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className="flex w-full items-center gap-3 rounded-md px-3 py-3
            text-sm font-medium text-red-600 transition-colors
            hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
        >
          <LogOut size={20} className="shrink-0" />

          <span className={collapsed ? "lg:hidden" : ""}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
