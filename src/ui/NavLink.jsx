import { Link } from "react-router-dom";

export default function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center p-2 space-x-3 text-gray-600 hover:bg-indigo-50 rounded-lg transition-colors mb-1"
    >
      {icon && <span className="text-gray-500">{icon}</span>}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
