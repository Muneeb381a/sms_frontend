import { FiMenu, FiX } from "react-icons/fi";
import SearchBar from "../../ui/SearchBar";

export default function Header({ toggleSidebar, isSidebarOpen }) {
  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
      >
        {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>
      <div className="flex items-center space-x-4">
        <SearchBar />
      </div>
    </header>
  );
}
