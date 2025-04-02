import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient'; // Import your API client
import { useAuth } from '../../../security/AuthContext';

const UserLeaveBalance = () => {
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const authContext = useAuth();
  const userId = authContext.userId;

  // Fetch leave balances for the user
  useEffect(() => {
    apiClient.get(`/leave-balances/user/${userId}`)
      .then(response => {
        setLeaveBalances(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leave balances:', error);
        setError('Failed to fetch leave balances');
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-4/5 justify-self-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Leave Balances</h2>

      {leaveBalances.length === 0 ? (
        <div className="text-center text-gray-600">No leave balances available</div>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Leave Type</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Balance</th>
            </tr>
          </thead>
          <tbody>
            {leaveBalances.map((leaveBalance) => (
              <tr key={leaveBalance.leaveType} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{leaveBalance.leaveType.name}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{leaveBalance.balance}</td>
                {/* <td className="px-4 py-2 text-sm text-gray-800">{leaveBalance.used}</td> */}
                {/* <td className="px-4 py-2 text-sm text-gray-800">{leaveBalance.remaining}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserLeaveBalance;