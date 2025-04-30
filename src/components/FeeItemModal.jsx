import { useState, useEffect } from 'react';
import api from '../services/fee-voucher-api';

export default function FeeItemModal({ voucher, onClose, theme, mode = 'create', feeItem }) {
  const [feeTypes, setFeeTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeeTypes = async () => {
      try {
        const { data } = await api.getFeeTypes();
        setFeeTypes(data);
        if (mode === 'edit' && feeItem) {
          setSelectedType(feeItem.fee_type_id);
          setAmount(feeItem.amount);
        }
      } catch (err) {
        setError('Failed to load fee types');
      }
    };
    
    fetchFeeTypes();
  }, [mode, feeItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!selectedType || !amount || amount <= 0) {
        throw new Error('Please fill all fields correctly');
      }

      if (mode === 'create') {
        await api.createFeeItem(voucher.id, selectedType, amount);
      } else {
        await api.updateFeeItem(feeItem.id, selectedType, amount);
      }
      
      onClose(true); // Pass true to indicate success
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-lg p-6 w-full max-w-md ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <h2 className="text-xl font-bold mb-4">
          {mode === 'create' ? 'Add Fee Item' : 'Edit Fee Item'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Fee Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-white border-gray-300'
              }`}
              required
            >
              <option value="">Select Fee Type</option>
              {feeTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-white border-gray-300'
              }`}
              step="0.01"
              min="0"
              required
            />
          </div>

          {error && (
            <div className={`p-2 rounded ${
              theme === 'dark' ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'
            }`}>
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => onClose()}
              className={`px-4 py-2 rounded ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-500' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}