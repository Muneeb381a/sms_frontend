import { Link } from "react-router-dom";

export default function NavLink({
  to,
  icon,
  label,
  isActive,
  theme,
  nested,
  collapsed,
}) {
  return (
    <div className="relative group">
      <Link
        to={to}
        className={`flex items-center gap-3 p-2 rounded-md transition-all duration-200
          ${
            theme === "dark"
              ? `text-gray-300 hover:bg-gray-800 ${
                  isActive ? "bg-indigo-600 text-white" : ""
                }`
              : `text-gray-600 hover:bg-gray-100 ${
                  isActive ? "bg-indigo-600 text-white" : ""
                }`
          }
          ${nested ? "pl-8" : "pl-4"}
          ${collapsed ? "justify-center px-2" : "w-full"}
          hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      >
        <span className="flex-shrink-0">{icon}</span>
        {!collapsed && (
          <span className="text-sm font-medium truncate">{label}</span>
        )}
      </Link>

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div
          className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1
            text-xs font-medium rounded-md shadow-lg z-50
            ${
              theme === "dark"
                ? "bg-gray-800 text-gray-200 border border-gray-700"
                : "bg-white text-gray-900 border border-gray-200"
            }
            opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}
        >
          {label}
        </div>
      )}
    </div>
  );
}
