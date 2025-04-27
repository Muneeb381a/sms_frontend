// components/ui/NavLink.jsx
import { Link } from 'react-router-dom';

export default function NavLink({ to, icon, label, isActive, theme }) {
  return (
    <Link
      to={to}
      className={`flex items-center p-2 space-x-3 rounded-lg transition-colors
        ${isActive 
          ? (theme === 'dark' 
              ? 'bg-indigo-800 text-white' 
              : 'bg-indigo-50 text-indigo-600')
          : (theme === 'dark' 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600')}
      `}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span className="font-medium">{label}</span>
    </Link>
  );
}