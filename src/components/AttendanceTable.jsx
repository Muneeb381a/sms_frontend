import { Link } from "react-router-dom";

const AttendanceTable = ({ attendance = [], onDelete }) => {
  // Add default value
  const getStatusBadge = (status) => (
    <span
      className={`px-2 py-1 rounded-full text-sm ${
        status === "present"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {status}
    </span>
  );

  // Handle empty state
  if (attendance.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No attendance records found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Student
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Class
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {attendance.map((record) => (
            <tr key={record.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.first_name} {record.last_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.class_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(record.attendance_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(record.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <Link
                  to={`/edit-attendance/${record.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(record.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
