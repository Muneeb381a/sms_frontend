import { useTheme } from "../context/ThemeContext";

const Loader = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`flex flex-col items-center space-y-4 p-6 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        <p className="text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;