import { FiChevronDown, FiChevronRight } from "react-icons/fi";

export default function NavSection({
  title,
  icon,
  children,
  isOpen,
  onToggle,
  theme,
  isActive,
  collapsed,
}) {
  return (
    <div className="relative group">
      {/* Section Header */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-3 p-2 rounded-md w-full text-left transition-all duration-200
          ${
            theme === "dark"
              ? `text-gray-300 hover:bg-gray-800 ${
                  isActive ? "bg-indigo-600 text-white" : ""
                }`
              : `text-gray-600 hover:bg-gray-100 ${
                  isActive ? "bg-indigo-600 text-white" : ""
                }`
          }
          ${collapsed ? "justify-center px-2" : "pl-4"}
          hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      >
        <span className="flex-shrink-0">{icon}</span>
        {!collapsed && (
          <span className="text-sm font-medium truncate flex-1">{title}</span>
        )}
        {!collapsed && (
          <span className="ml-auto">
            {isOpen ? (
              <FiChevronDown size={16} />
            ) : (
              <FiChevronRight size={16} />
            )}
          </span>
        )}
      </button>

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
          {title}
        </div>
      )}

      {/* Submenu (Open State) */}
      {!collapsed && isOpen && <div className="mt-1 space-y-1">{children}</div>}

      {/* Flyout Menu (Collapsed State) */}
      {collapsed && (
        <div
          className={`absolute left-full top-0 ml-2 w-48
            ${
              theme === "dark"
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }
            rounded-md shadow-lg z-50
            opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto
            transition-all duration-200 transform group-hover:translate-x-0
            pointer-events-none`}
        >
          <div className="py-2">{children}</div>
        </div>
      )}
    </div>
  );
}
