import React, { useState, useEffect } from "react";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const MarkAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [rangeStartDate, setRangeStartDate] = useState("");
  const [rangeEndDate, setRangeEndDate] = useState("");
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [hasMarkedAttendance, setHasMarkedAttendance] = useState(false);
  const [hasPunchedOut, setHasPunchedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [totalTimeWorked, setTotalTimeWorked] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("");
  const { employeeId: userId } = useParams();

  const handleMarkAttendance = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(`/attendance/user/mark/${userId}`);
      setMessage(response.data);
      setCheckInTime(new Date().toISOString());
      setHasMarkedAttendance(true);
      toast.success(response.data);
    } catch (error) {
      setMessage(
        error.response?.data || "Error marking attendance. Please try again."
      );
      toast.error(message);
    } finally {
      fetchAttendanceRecords();
      setLoading(false);
    }
  };

  const handlePunchOut = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(`/attendance/user/punchOut/${userId}`);
      setMessage(response.data);
      toast.success(response.data);
      setHasPunchedOut(true);

      const now = new Date();
      const worked = new Date(now - new Date(checkInTime));
      const hours = worked.getUTCHours().toString().padStart(2, "0");
      const minutes = worked.getUTCMinutes().toString().padStart(2, "0");
      const seconds = worked.getUTCSeconds().toString().padStart(2, "0");
      setTotalTimeWorked(`${hours}:${minutes}:${seconds}`);
    } catch (error) {
      setMessage(
        error.response?.data || "Error marking attendance. Please try again."
      );
      toast.error(message);
    } finally {
      fetchAttendanceRecords();
      setLoading(false);
    }
  };

  // Fetch attendance records for the user
  const fetchAttendanceRecords = async () => {
    try {
      const response = await apiClient.get(`/attendance/user/${userId}`);
      setAttendanceRecords(response.data);

      const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      const todayRecord = response.data.find((record) => record.date === today);

      if (todayRecord) {
        setHasMarkedAttendance(true);
        setCheckInTime(todayRecord.checkInTime);
        if (todayRecord.checkOutTime) {
          setHasPunchedOut(true);
          const worked = new Date(new Date(todayRecord.checkOutTime) - new Date(todayRecord.checkInTime));
          const hours = worked.getUTCHours().toString().padStart(2, "0");
          const minutes = worked.getUTCMinutes().toString().padStart(2, "0");
          const seconds = worked.getUTCSeconds().toString().padStart(2, "0");
          setTotalTimeWorked(`${hours}:${minutes}:${seconds}`);
        }
      }
    } catch (error) {
      toast.error("Error fetching attendance records.");
    }
  };


  // Fetch attendance within a date range
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

  // Effect to fetch attendance on component mount
  useEffect(() => {
    let timer;
    if (hasMarkedAttendance && !hasPunchedOut && checkInTime) {
      timer = setInterval(() => {
        const now = new Date();
        const elapsed = new Date(now - new Date(checkInTime));
        const hours = elapsed.getUTCHours().toString().padStart(2, "0");
        const minutes = elapsed.getUTCMinutes().toString().padStart(2, "0");
        const seconds = elapsed.getUTCSeconds().toString().padStart(2, "0");
        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    }

    return () => clearInterval(timer); // Cleanup timer
  }, [hasMarkedAttendance, hasPunchedOut, checkInTime]);

  useEffect(() => {
    if (userId) {
      fetchAttendanceRecords();
    }
  }, [userId]);

  const totalRecords = attendanceRecords.length;
  const totalPresent = attendanceRecords.filter((record) => record.status === "PRESENT").length;
  const totalHalfDay = attendanceRecords.filter((record) => record.status === "HALF_DAY").length;

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-gray-50 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800">Your Attendance</h2>

      {!hasMarkedAttendance ? (
        <div>
        <button
          className="m-0 w-full px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
          onClick={handleMarkAttendance}
          disabled={loading}
        >
          {loading ? "Punching In..." : "Punch In"}
        </button>
        <p className="mt-4 text-2xl font-medium text-gray-700">Attendance Not Marked For Today!</p>
        </div>
      ) : !hasPunchedOut ? (
        <div>
          <button
            className="m-0 w-full px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-300"
            onClick={handlePunchOut}
            disabled={loading}
          >
            {loading ? "Punching Out..." : "Punch Out"}
          </button>
          <p className="mt-4 text-2xl font-medium text-gray-700">Time Elapsed: {elapsedTime}</p>
        </div>
      ) : (
        <p className="mt-4 text-2xl font-medium text-gray-700">Total Time Worked Today: {totalTimeWorked}</p>
      )}


      {message && <p className="text-base text-center text-blue-600">{message}</p>}

      <div className="mt-6 w-full">
        <h3 className="text-xl font-semibold text-gray-700">Attendance Records</h3>

        <div className="flex justify-between w-full bg-blue-50 p-4 rounded-lg shadow mt-2">
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
        </div>

        <table className="min-w-full mt-6 bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Punch-in Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Punch-out Time</th>
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

export default MarkAttendance;
