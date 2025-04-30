import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3500/api/v1', 
});

export const getFeeTypes = () => api.get('/fee-type');
export const getFeeTypeById = (id) => api.get(`/fee-type/${id}`);
export const createFeeType = (name) => api.post('/fee-type', { name });
export const updateFeeType = (id, name) => api.patch(`/fee-type/${id}`, { name });
export const deleteFeeType = (id) => api.delete(`/fee-type/${id}`);