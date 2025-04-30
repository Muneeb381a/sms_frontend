import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3500/api/v1/fee',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  getStudentVouchers: (page = 1) => 
    api.get(`/?page=${page}`),
  
  createVoucher: (studentId, dueDate) => 
    api.post('/', { student_id: studentId, due_date: dueDate }),
  
  deleteVoucher: (id) => api.delete(`/${id}`),
  
  generatePDF: (id) => 
    api.get(`/${id}/pdf`, { responseType: 'blob' }),
  
  updatePayment: (id, amount) => 
    api.patch(`/${id}/payment`, { amount }),
  
  createFeeItem: (voucherId, data) => 
    api.post('/details', { voucher_id: voucherId, ...data })
};