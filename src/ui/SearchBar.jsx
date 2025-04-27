import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="w-64 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <FiSearch className="absolute right-3 top-3 text-gray-400" />
    </div>
  );
}
