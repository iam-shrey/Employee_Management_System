import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../security/AuthContext';
import { Popover } from 'flowbite-react';

const LeaveRequestsList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const authContext = useAuth();
  const userId = authContext.userId;

  useEffect(() => {
    apiClient.get(`/leave-requests/user/${userId}`)
      .then(response => {
        setLeaveRequests(response.data);
      })
      .catch(error => {
        console.error('Error fetching leave requests:', error);
      });
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-3/5 justify-self-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Leave Requests</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 text-sm font-medium text-gray-600">Leave Type</th>
            <th className="px-4 py-2 text-sm font-medium text-gray-600">Start Date</th>
            <th className="px-4 py-2 text-sm font-medium text-gray-600">End Date</th>
            <th className="px-4 py-2 text-sm font-medium text-gray-600">Reason</th>
            <th className="px-4 py-2 text-sm font-medium text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((leaveRequest) => (
            <tr key={leaveRequest.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-800">{leaveRequest.leaveType.name}</td>
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
    </div>
  );
};

export default LeaveRequestsList;