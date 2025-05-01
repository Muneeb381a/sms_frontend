import { useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Notification = ({ notification }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => notification.onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!notification) return null;

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-lg flex items-center space-x-2 ${
        notification.type === "success"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {notification.type === "success" ? (
        <FaCheckCircle className="w-5 h-5" />
      ) : (
        <FaTimesCircle className="w-5 h-5" />
      )}
      <span>{notification.message}</span>
    </div>
  );
};

export default Notification;
