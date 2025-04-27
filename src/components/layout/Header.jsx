import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import SearchBar from "../../ui/SearchBar";

import { useTheme } from '../../context/ThemeContext';

export default function Header({ toggleSidebar, isSidebarOpen }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`shadow-sm p-4 flex items-center justify-between
      ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
    >
      <button
        onClick={toggleSidebar}
        className={`p-2 rounded-lg transition-colors
          ${theme === 'dark' 
            ? 'hover:bg-gray-700 text-gray-300' 
            : 'hover:bg-gray-100 text-gray-600'}
        `}
      >
        {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors
            ${theme === 'dark' 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'}
          `}
        >
          {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
        <SearchBar theme={theme} />
      </div>
    </header>
  );
}