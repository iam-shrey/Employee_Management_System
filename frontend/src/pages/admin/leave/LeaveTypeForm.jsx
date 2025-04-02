import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";

const LeaveTypeForm = () => {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        quota: "",
    });
    const navigate = useNavigate();
    const { id } = useParams(); // For editing specific leave type

    useEffect(() => {
        if (id) {
            fetchLeaveType(id);
        }
    }, [id]);

    const fetchLeaveType = async (leaveTypeId) => {
        try {
            const response = await apiClient.get(`/leave-types/${leaveTypeId}`);
            setFormData(response.data);
        } catch (error) {
            console.error("Error fetching leave type:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post(`/leave-types`, formData);
            toast.success("Leave Type Updated Successfully");
            navigate("/leave-types");
        } catch (error) {
            console.error("Error saving leave type:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 max-h-[100vh-68px]">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                {id ? "Edit Leave Type" : "Add New Leave Type"}
            </h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6 space-y-4"
            >
                <div className="flex flex-col">
                    <label
                        htmlFor="name"
                        className="text-gray-700 font-semibold mb-2"
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="quota"
                        className="text-gray-700 font-semibold mb-2"
                    >
                        Quota
                    </label>
                    <input
                        type="number"
                        id="quota"
                        name="quota"
                        value={formData.quota}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="description"
                        className="text-gray-700 font-semibold mb-2"
                    >
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        {id ? "Update" : "Save"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/leave-types")}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeaveTypeForm;