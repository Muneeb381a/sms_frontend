import { Link, useLocation } from "react-router-dom";
import NavSection from "../../ui/NavSection";
import NavLink from "../../ui/NavLink";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiUser,
  FiCalendar,
  FiSettings,
  FiDollarSign,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useState, useEffect } from "react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { theme } = useTheme();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState({
    students: false,
    teachers: false,
    classes: false,
    fees: false,
  });

  useEffect(() => {
    const path = location.pathname;
    setActiveMenu({
      students: path.startsWith("/students"),
      teachers: path.startsWith("/teachers"),
      classes: path.startsWith("/classes"),
      fees: path.startsWith("/fees"),
    });
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const isChildActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed z-50 top-4 left-4 p-2 rounded-full transition-all duration-300
          ${
            theme === "dark"
              ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }
          shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300
          ${isOpen ? "w-64" : "w-16"}
          ${
            theme === "dark"
              ? "bg-gray-900 border-r border-gray-800"
              : "bg-white border-r border-gray-200"
          }
          shadow-lg overflow-hidden flex flex-col`}
      >
        {/* Logo Section */}
        <div className="p-4 flex items-center justify-center">
          <h1
            className={`text-lg font-semibold transition-opacity duration-300
              ${isOpen ? "opacity-100" : "opacity-0"}
              ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
          >
            <Link to="/">EduManage</Link>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <NavLink
            to="/"
            icon={<FiHome size={20} />}
            label="Dashboard"
            isActive={isActive("/")}
            theme={theme}
            collapsed={!isOpen}
          />

          {/* Students Section */}
          <NavSection
            title="Students"
            icon={<FiUsers size={20} />}
            isOpen={activeMenu.students}
            onToggle={() =>
              setActiveMenu((prev) => ({ ...prev, students: !prev.students }))
            }
            theme={theme}
            isActive={isChildActive("/students")}
            collapsed={!isOpen}
          >
            <NavLink
              to="/students"
              label="All Students"
              isActive={isActive("/students")}
              theme={theme}
              nested
              collapsed={!isOpen}
            />
            <NavLink
              to="/students/add"
              label="Add Student"
              isActive={isActive("/students/add")}
              theme={theme}
              nested
              collapsed={!isOpen}
            />
            <NavLink
              to="/students/groups"
              label="Groups"
              isActive={isActive("/students/groups")}
              theme={theme}
              nested
              collapsed={!isOpen}
            />
          </NavSection>

          {/* Teachers Section */}
          <NavSection
            title="Teachers"
            icon={<FiUser size={20} />}
            isOpen={activeMenu.teachers}
            onToggle={() =>
              setActiveMenu((prev) => ({ ...prev, teachers: !prev.teachers }))
            }
            theme={theme}
            isActive={isChildActive("/teachers")}
            collapsed={!isOpen}
          >
            <NavLink
              to="/teachers"
              label="All Teachers"
              isActive={isActive("/teachers")}
              theme={theme}
              nested
              collapsed={!isOpen}
            />
            <NavLink
              to="/teachers/add"
              label="Add Teacher"
              isActive={isActive("/teachers/add")}
              theme={theme}
              nested
              collapsed={!isOpen}
            />
            <NavLink
              to="/teachers/schedule"
              label="Schedule"
              isActive={isActive("/teachers/schedule")}
              theme={theme}
              nested
              collapsed={!isOpen}
            />
          </NavSection>

          {/* Classes Section */}
          <NavSection
            title="Classes"
            icon={<FiBook size={20} />}
            isOpen={activeMenu.classes}
            onToggle={() =>
              setActiveMenu((prev) => ({ ...prev, classes: !prev.classes }))
            }
            theme={theme}
            isActive={isChildActive("/classes")}
            collapsed={!isOpen}
          >
            <NavLink
              to="/classes"
              label="All Classes"
              isActive={isActive("/classes")}
              theme={theme}
              nested
              collapsed={!isOpen}
            />
            <NavLink
              to="/classes/add"
              label="Add Class"
              isActive={isActive("/classes/add")}
              theme={theme}
              nested
              collapsed={!isOpen}
            />
            <NavLink
              to="/classes/schedule"
              label="Class Schedule"
              isActive={isActive("/classes/schedule")}
              theme={theme}
              nested
              collapsed={!isOpen}
            />
          </NavSection>

          {/* Fees Section */}
          <NavSection
            title="Fees"
            icon={<FiDollarSign size={20} />}
            isOpen={activeMenu.fees}
            onToggle={() =>
              setActiveMenu((prev) => ({ ...prev, fees: !prev.fees }))
            }
            theme={theme}
            isActive={isChildActive("/fees")}
            collapsed={!isOpen}
          >
            <NavLink
              to="/fees"
              label="Manage Fees"
              isActive={isActive("/fees")}
              theme={theme}
              collapsed={!isOpen}
            />
            <NavLink
              to="/fees/add"
              label="Add Fee"
              isActive={isActive("/fees/add")}
              theme={theme}
              nested
              collapsed={!isOpen}
            />
            <NavLink
              to="/fees/vouchers"
              label="Fee Vouchers"
              isActive={isActive("/fees/vouchers")}
              theme={theme}
              nested
              collapsed={!isOpen}
            />
          </NavSection>

          {/* Attendance */}
          <NavLink
            to="/attendance"
            icon={<FiCalendar size={20} />}
            label="Attendance"
            isActive={isActive("/attendance")}
            theme={theme}
            collapsed={!isOpen}
          />

          {/* Settings */}
          <NavLink
            to="/settings"
            icon={<FiSettings size={20} />}
            label="Settings"
            isActive={isActive("/settings")}
            theme={theme}
            collapsed={!isOpen}
          />
        </nav>
      </aside>
    </>
  );
}
