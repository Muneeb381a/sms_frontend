import { Link, useLocation, useParams } from "react-router-dom";
import NavSection from "../../ui/NavSection";
import NavLink from "../../ui/NavLink";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiUser,
  FiCalendar,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiDollarSign,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import AddStudent from "../../pages/AddStudent";

export default function Sidebar({ isOpen }) {
  const { theme } = useTheme();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState({
    students: false,
    teachers: false,
    classes: false,
    fees: false,
  });

  const { id } = useParams();
  
  const toggleMenu = (menu) => {
    setActiveMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 transform transition-all duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${
          theme === "dark" 
            ? "bg-gray-800 border-r border-gray-700" 
            : "bg-white border-r border-gray-100"
        }`}
    >
      {/* Logo Section */}
      <div className="p-6 pb-4">
        <h1
          className={`text-2xl font-bold tracking-tight ${
            theme === "dark" 
              ? "text-indigo-400 hover:text-indigo-300" 
              : "text-indigo-600 hover:text-indigo-500"
          } transition-colors`}
        >
          <Link to="/">EduManage</Link>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col p-4 gap-1">
        <NavLink
          to="/"
          icon={<FiHome size={18} />}
          label="Dashboard"
          isActive={isActive("/")}
          theme={theme}
        />

        {/* Students Section */}
        <NavSection
          title="Students"
          icon={<FiUsers size={18} />}
          isOpen={activeMenu.students}
          onToggle={() => toggleMenu("students")}
          theme={theme}
          chevron={
            activeMenu.students ? (
              <FiChevronDown className="ml-auto" size={16} />
            ) : (
              <FiChevronRight className="ml-auto" size={16} />
            )
          }
        >
          <NavLink
            to="/students"
            label="All Students"
            isActive={isActive("/students")}
            theme={theme}
            nested
          />
          <NavLink
            to="/students/add"
            label="Add Student"
            isActive={isActive("/students/add")}
            theme={theme}
            nested
          />
          <NavLink
            to="/students/groups"
            label="Student Groups"
            isActive={isActive("/students/groups")}
            theme={theme}
            nested
          />
        </NavSection>

        {/* Teachers Section */}
        <NavSection
          title="Teachers"
          icon={<FiUser size={18} />}
          isOpen={activeMenu.teachers}
          onToggle={() => toggleMenu("teachers")}
          theme={theme}
          chevron={
            activeMenu.teachers ? (
              <FiChevronDown className="ml-auto" size={16} />
            ) : (
              <FiChevronRight className="ml-auto" size={16} />
            )
          }
        >
          <NavLink
            to="/teachers"
            label="All Teachers"
            isActive={isActive("/teachers")}
            theme={theme}
            nested
          />
          <NavLink
            to="/teachers/add"
            label="Add Teacher"
            isActive={isActive("/teachers/add")}
            theme={theme}
            nested
          />
          <NavLink
            to="/teachers/schedule"
            label="Schedule"
            isActive={isActive("/teachers/schedule")}
            theme={theme}
            nested
          />
        </NavSection>

        {/* Classes Section */}
        <NavSection
          title="Classes"
          icon={<FiBook size={18} />}
          isOpen={activeMenu.classes}
          onToggle={() => toggleMenu("classes")}
          theme={theme}
          chevron={
            activeMenu.classes ? (
              <FiChevronDown className="ml-auto" size={16} />
            ) : (
              <FiChevronRight className="ml-auto" size={16} />
            )
          }
        >
          <NavLink
            to="/classes"
            label="All Classes"
            isActive={isActive("/classes")}
            theme={theme}
            nested
          />
          <NavLink
            to="/classes/add"
            label="Add Class"
            isActive={isActive("/classes/add")}
            theme={theme}
            nested
          />
          <NavLink
            to="/classes/schedule"
            label="Class Schedule"
            isActive={isActive("/classes/schedule")}
            theme={theme}
            nested
          />
        </NavSection>

        {/* Fees Section */}
        <NavSection
          title="Fees"
          icon={<FiDollarSign size={18} />}
          isOpen={activeMenu.fees}
          onToggle={() => toggleMenu("fees")}
          theme={theme}
          chevron={
            activeMenu.fees ? (
              <FiChevronDown className="ml-auto" size={16} />
            ) : (
              <FiChevronRight className="ml-auto" size={16} />
            )
          }
        >
          <NavLink
            to="/fees"
            label="Manage Fees"
            isActive={isActive("/fees")}
            theme={theme}
            nested
          />
          <NavLink
            to="/fees/add"
            label="Add Fee"
            isActive={isActive("/fees/add")}
            theme={theme}
            nested
          />
          <NavLink
            to="/fees/vouchers"
            label="Fee Vouchers"
            isActive={location.pathname.startsWith("/fees/vouchers")}
            theme={theme}
            nested
          />
        </NavSection>

        {/* Attendance Section */}
        <div className={`mt-4 pt-4 ${theme === 'dark' ? 'border-t border-gray-700' : 'border-t border-gray-100'}`}>
          <NavLink
            to="/attendance"
            icon={<FiCalendar size={18} />}
            label="Attendance"
            isActive={isActive("/attendance")}
            theme={theme}
          />
          <NavLink
            to="/attendance/mark-attendance"
            label="Mark Attendance"
            isActive={isActive("/attendance/mark-attendance")}
            theme={theme}
            nested
          />
        </div>

        {/* Settings */}
        <div className={`mt-4 pt-4 ${theme === 'dark' ? 'border-t border-gray-700' : 'border-t border-gray-100'}`}>
          <NavLink
            to="/settings"
            icon={<FiSettings size={18} />}
            label="Settings"
            isActive={isActive("/settings")}
            theme={theme}
          />
        </div>
      </nav>
    </aside>
  );
}