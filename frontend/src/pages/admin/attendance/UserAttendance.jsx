import React, { useState, useEffect } from "react";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const UserAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [rangeStartDate, setRangeStartDate] = useState("");
  const [rangeEndDate, setRangeEndDate] = useState("");
  const [loadingRecords, setLoadingRecords] = useState(false);
  const location = useLocation();
  const { employee } = location.state || {};
  const { employeeId: userId } = useParams();
  const navigate = useNavigate();

  const fetchAttendanceRecords = async () => {
    setLoadingRecords(true);
    try {
      const response = await apiClient.get(`/attendance/user/${userId}`);
      setAttendanceRecords(response.data);
    } catch (error) {
      toast.error("Error fetching attendance records.");
    } finally {
      setLoadingRecords(false);
    }
  };

  const fetchAttendanceInRange = async () => {
    setLoadingRecords(true);
    try {
      const response = await apiClient.get(
        `/attendance/user/${userId}/range?startDate=${rangeStartDate}&endDate=${rangeEndDate}`
      );
      setAttendanceRecords(response.data);
    } catch (error) {
      toast.error("Error fetching attendance records in date range.");
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAttendanceRecords();
    }
  }, [userId]);

  // Compute statistics
  const totalRecords = attendanceRecords.length;
  const totalPresent = attendanceRecords.filter((record) => record.status === "PRESENT").length;
  const totalHalfDay = attendanceRecords.filter((record) => record.status === "HALF_DAY").length;

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-gray-50 rounded-lg shadow-md w-full max-w-4xl mx-auto mt-10">
      {/* Employee Header */}
      <div className="flex flex-col items-center bg-white p-4 shadow rounded-lg w-full">
        <h2 className="text-2xl font-bold text-gray-800">{employee?.firstName+" "+employee?.lastName || "Employee"}</h2>
        <p className="text-gray-600">{employee?.designation || "Designation"}</p>
      </div>

      {/* Attendance Statistics */}
      <div className="flex justify-between w-full bg-blue-50 p-4 rounded-lg shadow">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-700">Total Records</h4>
          <p className="text-blue-600 text-2xl">{totalRecords}</p>
        </div>
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-700">Total Present</h4>
          <p className="text-green-600 text-2xl">{totalPresent}</p>
        </div>
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-700">Total Half Days</h4>
          <p className="text-yellow-600 text-2xl">{totalHalfDay}</p>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="mt-6 w-full">
        <h3 className="text-xl font-semibold text-gray-700">Attendance Records</h3>

        {/* Date Range Filter */}
        <div className="flex space-x-4 mt-4">
          <input
            type="date"
            value={rangeStartDate}
            onChange={(e) => setRangeStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={rangeEndDate}
            onChange={(e) => setRangeEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchAttendanceInRange}
            className="px-6 py-2 bg-green-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Filter by Range
          </button>
          <button
            onClick={()=>navigate(`/edit/attendance/${userId}`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Edit Attendance
          </button>
        </div>

        {/* Attendance Table */}
        <table className="min-w-full mt-6 bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Check-in Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Check-out Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {loadingRecords ? (
              <tr>
                <td colSpan="3" className="px-6 py-3 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : attendanceRecords.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-3 text-center text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              attendanceRecords.map((record, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-6 py-3 text-sm text-gray-800">{record.date}</td>
                  <td className="px-6 py-3 text-sm text-gray-800">
                    {new Date(record.checkInTime).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-800">
                    {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-800">{record.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAttendance;