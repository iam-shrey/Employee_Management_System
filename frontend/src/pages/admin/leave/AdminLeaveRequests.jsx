import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import apiClient from '../../../api/apiClient';
import { Popover } from 'flowbite-react';
import { toast } from 'react-toastify';

const AdminLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch leave requests
  const fetchLeaveRequests = () => {
    apiClient.get('/leave-requests/admin')
      .then(response => {
        const pendingRequests = response.data.filter(request => request.status === 'PENDING');
        setLeaveRequests(pendingRequests);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leave requests:', error);
        setLoading(false);
      });
  };

  // Fetch leave requests on initial render
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Handle status change for leave request
  const handleStatusChange = (leaveRequestId, status) => {
    apiClient.put(`/leave-requests/update/${leaveRequestId}?status=${status}`)
      .then(response => {
        toast.success(response.data)
        fetchLeaveRequests();
      })
      .catch(error => {
        toast.error(error.response.data)
        console.error('Error updating leave request status:', error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-4/5 justify-self-center">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">All Leave Requests</h2>
        {/* Add the navigation button */}
        <Link to="/employees/leave-records">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Past Leave Records
          </button>
        </Link>
      </div>
      
      {leaveRequests.length === 0 ? (
        <div className="text-center text-gray-600">No pending leave requests</div>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Employee Name</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Leave Type</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Start Date</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">End Date</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Reason</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((leaveRequest) => (
              <tr key={leaveRequest.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{leaveRequest.employeeName}</td>
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
                <td className="px-4 py-2 text-sm text-gray-800">
                  <button 
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => handleStatusChange(leaveRequest.id, 'APPROVED')}
                  >
                    Approve
                  </button>
                  <button 
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleStatusChange(leaveRequest.id, 'REJECTED')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminLeaveRequests;