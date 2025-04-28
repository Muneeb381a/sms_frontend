import { Routes, Route } from "react-router-dom";
import Teachers from "../../pages/Teachers";
import Classes from "../../pages/Classes";
import Dashboard from "../../pages/Dashboard";
import StudentList from "../../pages/StudentsList";

export default function MainContent() {
  return (
    <main className="p-6">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/classes/*" element={<Classes />} />
        {/* Add more routes as needed */}
      </Routes>
    </main>
  );
}
