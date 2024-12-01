import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { toast } from 'react-toastify';

function AttendanceManagement() {

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [date, setDate] = useState('');
  const [attendanceByDate, setAttendanceByDate] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchAttendanceByEmployee();
  }, []);

  const fetchAttendanceByEmployee = () => {
    apiClient.get('/users/attendance')
      .then(response => {
        setAttendanceRecords(response.data);
      })
      .catch(error => {
        console.error('Error fetching attendance:', error);
      });
  };

  const markAttendance = () => {
    apiClient.post('/users/mark', { status }, { headers: { 'Content-Type': 'application/json' } })
      .then(response => {
        toast.success(response.data);
        setStatus('');
        fetchAttendanceByEmployee();
      })
      .catch(error => {
        console.error('Error marking attendance:', error);
      });
  };

  const fetchAttendanceByDate = () => {
    apiClient.get(`/users/date/${date}`)
      .then(response => {
        setAttendanceByDate(response.data);
      })
      .catch(error => {
        console.error('Error fetching attendance by date:', error);
      });
  };

  return (
    <div className="w-4/5 mx-auto mt-8 flex-1">
      <h2 className="text-2xl font-bold mb-4">Attendance Management</h2>

      <div className="mb-8">
        <label className="block font-semibold">Mark Attendance Status:</label>
        <select
          className="border p-2 w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="On Leave">On Leave</option>
        </select>
        <button
          onClick={() => markAttendance()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Mark Attendance
        </button>
      </div>


      <div className="mb-8">
        <h3 className="text-xl font-semibold">My Attendance Records</h3>
        <table className="w-full bg-white border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border text-center">Date</th>
              <th className="py-2 px-4 border text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border text-center">{record.date}</td>
                <td className="py-2 px-4 border text-center">{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Search Attendance by Date</h3>
        <input
          type="date"
          className="border p-2 w-full mt-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          onClick={fetchAttendanceByDate}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Search by Date
        </button>

        {attendanceByDate.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold">Attendance on {date}</h4>
            <table className="w-full bg-white border mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border text-center">Employee ID</th>
                  <th className="py-2 px-4 border text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceByDate.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border text-center">{record.employee.id}</td>
                    <td className="py-2 px-4 border text-center">{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceManagement;