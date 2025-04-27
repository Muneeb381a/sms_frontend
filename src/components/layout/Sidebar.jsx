import { Link } from "react-router-dom";
import NavSection from "../../ui/NavSection";
import NavLink from "../../ui/NavLink";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiUser,
  FiCalendar,
  FiSettings,
} from "react-icons/fi";

export default function Sidebar({ isOpen }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white shadow-lg w-64 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-600">EduManage</h1>
      </div>

      <nav className="p-4">
        <NavLink to="/" icon={<FiHome />} label="Dashboard" />

        <NavSection title="Students" icon={<FiUsers />}>
          <NavLink to="/students" label="All Students" />
          <NavLink to="/students/add" label="Add Student" />
          <NavLink to="/students/groups" label="Student Groups" />
        </NavSection>

        <NavSection title="Teachers" icon={<FiUser />}>
          <NavLink to="/teachers" label="All Teachers" />
          <NavLink to="/teachers/add" label="Add Teacher" />
          <NavLink to="/teachers/schedule" label="Schedule" />
        </NavSection>

        <NavSection title="Classes" icon={<FiBook />}>
          <NavLink to="/classes" label="All Classes" />
          <NavLink to="/classes/add" label="Add Class" />
          <NavLink to="/classes/schedule" label="Class Schedule" />
        </NavSection>

        <NavLink to="/attendance" icon={<FiCalendar />} label="Attendance" />
        <NavLink to="/settings" icon={<FiSettings />} label="Settings" />
      </nav>
    </aside>
  );
}
