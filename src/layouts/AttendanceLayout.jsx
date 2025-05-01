import { Outlet } from 'react-router-dom';

const AttendanceLayout = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Outlet /> {/* This renders nested routes */}
    </div>
  );
};

export default AttendanceLayout;