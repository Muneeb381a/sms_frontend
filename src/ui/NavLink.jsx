import { NavLink as ReactNavLink } from "react-router-dom";

export default function NavLink({ to, icon, label, theme }) {
  return (
    <ReactNavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-2 space-x-3 rounded-lg transition-colors
        ${
          isActive
            ? theme === "dark"
              ? "bg-indigo-800 text-white"
              : "bg-indigo-50 text-indigo-600"
            : theme === "dark"
            ? "hover:bg-gray-700 text-gray-300"
            : "hover:bg-gray-100 text-gray-600"
        }`
      }
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span className="font-medium">{label}</span>
    </ReactNavLink>
  );
}
