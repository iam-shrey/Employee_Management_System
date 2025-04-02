import React, { useState } from "react";
import apiClient from "../../../api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AttendanceEditForm = () => {

  const {userId} = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: userId,
    date: "",
    checkInTime: "",
    checkOutTime: "",
    status: "PRESENT",
  });

  const statuses = ["PRESENT", "HALF_DAY", "LEAVE", "INSUFFICIENT_TIME", "NOT_PUNCHED_OUT"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.put("/attendance/admin/edit", formData);
      toast.success(response.data);
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data || "An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Edit Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="userId">
            Employee ID
          </label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="checkInTime">
            Check-In Time
          </label>
          <input
            type="datetime-local"
            id="checkInTime"
            name="checkInTime"
            value={formData.checkInTime}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="checkOutTime">
            Check-Out Time
          </label>
          <input
            type="datetime-local"
            id="checkOutTime"
            name="checkOutTime"
            value={formData.checkOutTime}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update Attendance
        </button>
      </form>
    </div>
  );
};

export default AttendanceEditForm;