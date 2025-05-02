import { Routes, Route } from "react-router-dom";
import Teachers from "../../pages/Teachers";
import Classes from "../../pages/Classes";
import Dashboard from "../../pages/Dashboard";
import Students from "../../pages/Students";
import Fees from "../../pages/Fees";
import AttendanceDashboard from "../../pages/AttendanceDashboard";
import MarkAttendanceForm from "../MarkAttendanceForm";
import AttendanceLayout from "../../layouts/AttendanceLayout";
import AddTeacher from "../../pages/AddTeacher";

export default function MainContent() {
  return (
    <main className="p-6">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students/*" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/teachers/add" element={<AddTeacher />} />
        <Route path="/classes/*" element={<Classes />} />
        <Route path="/fees/*" element={<Fees />} />
        <Route path="/attendance" element={<AttendanceLayout />}>
          <Route index element={<AttendanceDashboard />} />
          <Route path="mark-attendance" element={<MarkAttendanceForm />} />
          {/* <Route path="edit/:id" element={<EditAttendance />} /> */}
        </Route>
        {/* Add more routes as needed */}
      </Routes>
    </main>
  );
}
