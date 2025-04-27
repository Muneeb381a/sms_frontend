import { Routes, Route } from "react-router-dom";
import Students from "../../pages/Students";
import Teachers from "../../pages/Teachers";
import Classes from "../../pages/Classes";
import Dashboard from "../../pages/Dashboard";

export default function MainContent() {
  return (
    <main className="p-6">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/classes/*" element={<Classes />} />
        {/* Add more routes as needed */}
      </Routes>
    </main>
  );
}
