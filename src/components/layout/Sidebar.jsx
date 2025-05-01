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
      className={`fixed top-0 left-0 h-full shadow-lg w-64 transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
    >
      <div
        className={`p-4 border-b ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h1
          className={`text-xl font-bold ${
            theme === "dark" ? "text-indigo-400" : "text-indigo-600"
          }`}
        >
          EduManage
        </h1>
      </div>

      <nav className="p-4">
        <NavLink
          to="/"
          icon={
            <FiHome
              className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
            />
          }
          label="Dashboard"
          isActive={isActive("/")}
        />

        <NavSection
          title="Students"
          icon={
            <FiUsers
              className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
            />
          }
          isOpen={activeMenu.students}
          onToggle={() => toggleMenu("students")}
          theme={theme}
        >
          <NavLink
            to="/students"
            label="All Students"
            isActive={isActive("/students")}
          />
          <NavLink
            to="/students/add"
            label="Add Student"
            isActive={isActive("/students/add")}
          />
          <NavLink
            to="/students/groups"
            label="Student Groups"
            isActive={isActive("/students/groups")}
          />
        </NavSection>

        <NavSection
          title="Teachers"
          icon={
            <FiUser
              className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
            />
          }
          isOpen={activeMenu.teachers}
          onToggle={() => toggleMenu("teachers")}
          theme={theme}
        >
          <NavLink
            to="/teachers"
            label="All Teachers"
            isActive={isActive("/teachers")}
          />
          <NavLink
            to="/teachers/add"
            label="Add Teacher"
            isActive={isActive("/teachers/add")}
          />
          <NavLink
            to="/teachers/schedule"
            label="Schedule"
            isActive={isActive("/teachers/schedule")}
          />
        </NavSection>

        <NavSection
          title="Classes"
          icon={
            <FiBook
              className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
            />
          }
          isOpen={activeMenu.classes}
          onToggle={() => toggleMenu("classes")}
          theme={theme}
        >
          <NavLink
            to="/classes"
            label="All Classes"
            isActive={isActive("/classes")}
          />
          <NavLink
            to="/classes/add"
            label="Add Class"
            isActive={isActive("/classes/add")}
          />
          <NavLink
            to="/classes/schedule"
            label="Class Schedule"
            isActive={isActive("/classes/schedule")}
          />
        </NavSection>
        <NavSection
          title="Fees"
          icon={
            <FiDollarSign
              className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
            />
          }
          isOpen={activeMenu.fees}
          onToggle={() => toggleMenu("fees")}
          theme={theme}
        >
          <NavLink
            to="/fees"
            label="Manage Fees"
            isActive={isActive("/fees")}
          />
          <NavLink
            to="/fees/add"
            label="Add Fee"
            isActive={isActive("/fees/add")}
          />
          <NavLink
            to="/fees/vouchers"
            label="Fee Vouchers"
            isActive={location.pathname.startsWith("/fees/vouchers")}
          />
        </NavSection>

        <NavLink
          to="/attendance"
          icon={
            <FiCalendar
              className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
            />
          }
          label="Attendance"
          isActive={isActive("/attendance")}
        />
        <NavLink
          to="/attendance/mark-attendance"
          icon={
            <FiCalendar
              className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
            />
          }
          label="Mark Attendance"
          isActive={isActive("/attendance/mark-attendance")}
        />

        <NavLink
          to="/settings"
          icon={
            <FiSettings
              className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
            />
          }
          label="Settings"
          isActive={isActive("/settings")}
        />
      </nav>
    </aside>
  );
}
