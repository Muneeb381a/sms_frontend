import { useEffect, useState } from "react";
import axios from "axios";

export const useClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("/api/v1/classes");
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return { classes, loading };
};

export const useStudents = (classId) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!classId) return;

    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `/api/v1/students?class_id=${classId}`
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [classId]);

  return { students };
};
