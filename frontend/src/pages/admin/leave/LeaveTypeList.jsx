import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";

const LeaveTypeList = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const response = await apiClient.get("/leave-types");
      setLeaveTypes(response.data);
    } catch (error) {
      console.error("Error fetching leave types:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this leave type?")) {
      try {
        await apiClient.delete(`/leave-types/${id}`);
        fetchLeaveTypes();
      } catch (error) {
        console.error("Error deleting leave type:", error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 max-h-[calc(100vh-68px)] w-3/4 justify-self-center">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Leave Types</h1>
        <button
          onClick={()=>navigate("/add-leave-type")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add New Leave Type
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Quota</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveTypes.map((leaveType) => (
              <tr
                key={leaveType.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="px-4 py-2 text-center">{leaveType.id}</td>
                <td className="px-4 py-2 text-center">{leaveType.name}</td>
                <td className="px-4 py-2 text-center">{leaveType.quota}</td>
                <td className="px-4 py-2 text-center">{leaveType.description}</td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <button
                    onClick={() => navigate(`/edit-leave-type/${leaveType.id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(leaveType.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveTypeList;