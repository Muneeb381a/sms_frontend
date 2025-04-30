import { useState, useEffect } from 'react';
import api from '../services/fee-voucher-api';

export default function PaymentModal({ voucher, onClose, theme }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (voucher) {
      setRemaining(voucher.total_amount - voucher.paid_amount);
    }
  }, [voucher]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!amount || amount <= 0 || amount > remaining) {
        throw new Error('Invalid payment amount');
      }

      await api.updatePayment(voucher.id, amount);
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
        <h2 className="text-xl font-bold mb-4">Record Payment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Remaining Balance</label>
            <input
              type="text"
              value={`$${remaining.toFixed(2)}`}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-100 border-gray-300'
              }`}
              disabled
            />
          </div>

          <div>
            <label className="block mb-2">Payment Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-500'
              }`}
              step="0.01"
              min="0"
              max={remaining}
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
              {loading ? 'Processing...' : 'Submit Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}