import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import MainContent from "./components/layout/MainContent";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastContainer } from "react-toastify";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ThemeProvider>
      <ToastContainer />
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Sidebar isOpen={isSidebarOpen} />
          <div
            className={`transition-margin duration-300 ${
              isSidebarOpen ? "ml-64" : "ml-0"
            }`}
          >
            <Header
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              isSidebarOpen={isSidebarOpen}
            />
            <MainContent />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}
