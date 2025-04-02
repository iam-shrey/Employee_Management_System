import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LeaveRequestForm = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveRequestData, setLeaveRequestData] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/leave-types')
      .then(response => {
        setLeaveTypes(response.data);
      })
      .catch(error => {
        console.error('Error fetching leave types:', error);
        toast.error('Failed to load leave types.');
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveRequestData({
      ...leaveRequestData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    apiClient.post('/leave-requests/create', leaveRequestData)
      .then(() => {
        toast.success('Leave request submitted successfully.');
        setLeaveRequestData({
          leaveTypeId: '',
          startDate: '',
          endDate: '',
          reason: '',
        });
      })
      .catch(error => {
        console.error('Error submitting leave request:', error, leaveRequestData);
        toast.error('Error submitting leave request.');
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg min-h-[calc(100vh-68px)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Leave Request Form</h2>
        <button
          onClick={()=>navigate('/your-leave-balance')}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Your Leave Balance
        </button>
        <button
          onClick={()=>navigate('/your-leaves')}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Your Leave History
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Leave Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Leave Type:</label>
          <select
            name="leaveTypeId"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={leaveRequestData.leaveTypeId}
            onChange={handleChange}
            required
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((leaveType) => (
              <option key={leaveType.id} value={leaveType.id}>
                {leaveType.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className='mr-3'>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date:</label>
          <input
            type="date"
            name="startDate"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={leaveRequestData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* End Date */}
        <div className='mr-3'>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date:</label>
          <input
            type="date"
            name="endDate"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={leaveRequestData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason:</label>
          <textarea
            name="reason"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={leaveRequestData.reason}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Leave Request
        </button>
      </form>
    </div>
  );
};

export default LeaveRequestForm;