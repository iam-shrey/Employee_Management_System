import React, { useState, useEffect } from "react";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";
import {
  HiFilter,
} from "react-icons/hi";

const Attendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchAttendanceRecords = async (startDate = "", endDate = "") => {
    setLoading(true);
    try {
      let url = "/attendance/admin";

      if (startDate && endDate) {
        url = `/attendance/admin/range?startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await apiClient.get(url);
      setAttendanceList(response.data);
      setError("");
    } catch (err) {
      setError("Error fetching attendance records");
      toast.error("Error fetching attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  // Handle date range change
  const handleDateRangeChange = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }
    fetchAttendanceRecords(startDate, endDate);
  };

  const setTodayDate = () => {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    fetchAttendanceRecords(today, today);
  };

  // Handle date input changes
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const totalRecords = attendanceList.length;
  const totalPresent = attendanceList.filter((record) => record.status === "PRESENT").length;
  const totalHalfDay = attendanceList.filter((record) => record.status === "HALF_DAY").length;

  return (
    <div className="flex flex-col items-center p-6 space-y-4 bg-gray-50 rounded-lg shadow-md w-3/4 mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Attendance Records</h2>

      <div className="mb-6 flex flex-col sm:flex-row sm:space-x-6 w-full max-w-4xl mx-auto">
        <div className="flex flex-col w-full sm:w-1/3">
          <label className="text-gray-600 mb-2 text-sm font-semibold">Start Date</label>
          <input
            type="date"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>

        <div className="flex flex-col w-full sm:w-1/3">
          <label className="text-gray-600 mb-2 text-sm font-semibold">End Date</label>
          <input
            type="date"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>

        <div className="flex items-center justify-center sm:w-1/3">
          <button
            onClick={handleDateRangeChange}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            alt="filter"
          >
            <HiFilter className="w-5 h-5"/>
          </button>
        </div>
        <div className="flex items-center justify-center sm:w-1/3">
          <button
            onClick={setTodayDate}
            className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Today's Record
          </button>
        </div>
      </div>



      {error && <p className="text-sm text-center text-red-600 mb-4">{error}</p>}

      {loading && <p>Loading...</p>}

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

      {!loading && !error && (
        <div className="overflow-x-auto w-full" style={{ maxHeight: '270px', overflowY: 'auto' }}>
          <table className="table-auto w-full bg-white border-collapse shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left text-gray-600">User ID</th>
                <th className="px-4 py-2 border-b text-left text-gray-600">Name</th>
                <th className="px-4 py-2 border-b text-left text-gray-600">Date</th>
                <th className="px-4 py-2 border-b text-left text-gray-600">Check-in Time</th>
                <th className="px-4 py-2 border-b text-left text-gray-600">Check-out Time</th>
                <th className="px-4 py-2 border-b text-left text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.map((attendance) => (
                <tr key={attendance.id}>
                  <td className="px-4 py-2 border-b">{attendance.user.id}</td>
                  <td className="px-4 py-2 border-b">
                    {attendance.user.firstName + " " + attendance.user.lastName}
                  </td>
                  <td className="px-4 py-2 border-b">{attendance.date}</td>
                  <td className="px-4 py-2 border-b">{new Date(attendance.checkInTime).toLocaleTimeString()}</td>
                  <td className="px-4 py-2 border-b">{attendance.checkOutTime ? new Date(attendance.checkOutTime).toLocaleTimeString() : "N/A"}</td>
                  <td className="px-4 py-2 border-b">{attendance.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      )}
    </div>
  );
};

export default Attendance;
