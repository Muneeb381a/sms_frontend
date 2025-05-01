import axios from 'axios';

const API_BASE = 'http://localhost:3500/api/v1/attendance';


export const fetchAttendance = async (page = 1, limit = 10) => {
  const response = await axios.get(`${API_BASE}?page=${page}&limit=${limit}`);
  return {
    records: response.data.data,
    pagination: response.data.pagination
  };
};

export const markClassAttendance = async (data) => {
  await axios.post(`${API_BASE}/class`, data);
};

export const deleteAttendanceRecord = async (id) => {
  await axios.delete(`${API_BASE}/${id}`);
};

export const updateAttendanceRecord = async (id, status) => {
  const response = await axios.patch(`${API_BASE}/${id}`, { status });
  return response.data.data;
};