import { FiChevronDown, FiChevronRight } from "react-icons/fi";

// components/ui/NavSection.jsx
export default function NavSection({ title, icon, children, isOpen, onToggle, theme }) {
    return (
      <div className="mb-2">
        <button
          onClick={onToggle}
          className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors
            ${theme === 'dark' 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-700'}
          `}
        >
          <div className="flex items-center space-x-3">
            {icon}
            <span className="font-medium">{title}</span>
          </div>
          {isOpen ? (
            <FiChevronDown className="w-5 h-5" />
          ) : (
            <FiChevronRight className="w-5 h-5" />
          )}
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}>
          <div className="pl-7 mt-1 space-y-1">
            {children}
          </div>
        </div>
      </div>
    );
  }