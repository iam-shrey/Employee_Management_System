import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';
import { Popover } from 'flowbite-react';
import { format } from 'date-fns';

const AdminPastLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/leave-requests/admin')
      .then(response => {
        const pastRequests = response.data.filter(request => request.status === 'APPROVED' || request.status === 'REJECTED');
        setLeaveRequests(pastRequests);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leave requests:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-4/5 justify-self-center overflow-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Leave Records</h2>

      {leaveRequests.length === 0 ? (
        <div className="text-center text-gray-600">No past leave requests found</div>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Employee Name</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Leave Type</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Date Created</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Created At</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Last Updated At</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">From</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">To</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Reason</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((leaveRequest) => (
              <tr key={leaveRequest.id} className="border-b hover:bg-gray-50 text-center">
                <td className="px-4 py-2 text-sm text-gray-800">{leaveRequest.employeeName}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{leaveRequest.leaveType.name}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{format(new Date(leaveRequest.createdAt), 'yyyy-MM-dd')}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{format(new Date(leaveRequest.createdAt), 'hh:mm:ss a')}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{format(new Date(leaveRequest.updatedAt), 'hh:mm:ss a')}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{leaveRequest.startDate}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{leaveRequest.endDate}</td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  <Popover
                    trigger="hover"
                    aria-labelledby="default-popover"
                    content={
                      <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
                        <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                          <h3 id="default-popover" className="font-semibold text-gray-900 dark:text-white">Summary</h3>
                        </div>
                        <div className="px-3 py-2">
                          <p>{leaveRequest.reason}</p>
                        </div>
                      </div>
                    }
                  >
                    <span className='underline cursor-pointer'>See Here</span>
                  </Popover>
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">{leaveRequest.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPastLeaveRequests;