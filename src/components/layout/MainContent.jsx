import { Routes, Route } from "react-router-dom";
import Teachers from "../../pages/Teachers";
import Classes from "../../pages/Classes";
import Dashboard from "../../pages/Dashboard";
import Students from "../../pages/Students";
import Fees from "../../pages/Fees";

export default function MainContent() {
  return (
    <main className="p-6">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students/*" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/classes/*" element={<Classes />} />
        <Route path="/fees/*" element={<Fees />} />
        {/* Add more routes as needed */}
      </Routes>
    </main>
  );
}