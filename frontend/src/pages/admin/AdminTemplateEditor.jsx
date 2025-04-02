import React, { useState, useEffect } from "react";
import apiClient from "../../api/apiClient"; 
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminTemplateEditor = () => {
    const [templates, setTemplates] = useState([]); // Store template objects
    const [selectedId, setSelectedId] = useState("");
    const [templateData, setTemplateData] = useState({
        header: "",
        body: "",
        footer: "",
    });

    const navigate = useNavigate();

    const fetchTemplateNames = () => {
        apiClient
            .get("/admin/templates/names")
            .then((response) => {
                setTemplates(response.data); // Update state with templates
                console.log("Fetched templates:", response.data); // Debug log
            })
            .catch((error) => {
                console.error("Error fetching template names:", error);
            });
    };

    // Call fetchTemplateNames inside useEffect
    useEffect(() => {
        fetchTemplateNames();
    }, []);

    const fetchTemplateData = (id) => {
        apiClient
            .get(`/admin/templates/${id}`)
            .then((response) => {
                setTemplateData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching template data:", error); // Handle any errors
            });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await apiClient.patch(`/admin/templates/${selectedId}`, templateData);
            toast.success("Template updated successfully!");
        } catch (error) {
            console.error("Error updating template:", error);
            toast.error("Failed to update template.");
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setTemplateData({ ...templateData, [name]: value });
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Edit Offer Letter Template
            </h2>

            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Select Template:</label>
                <select
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={selectedId}
                    onChange={(event) => {
                        const id = event.target.value;
                        setSelectedId(id);
                        if (id) fetchTemplateData(id); // Fetch data for the selected template
                    }}
                >
                    <option value="" disabled>Select Template</option>
                    {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                            {template.name} {/* Display template name */}
                        </option>
                    ))}
                </select>
            </div>


            {selectedId && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Header:
                        </label>
                        <textarea
                            name="header"
                            value={templateData.header!=null ? templateData.header : ""}
                            onChange={handleInputChange}
                            rows="10"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Body:
                        </label>
                        <textarea
                            name="body"
                            value={templateData.body!=null ? templateData.body : ""}
                            onChange={handleInputChange}
                            rows="15"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Footer:
                        </label>
                        <textarea
                            name="footer"
                            value={templateData.footer!=null ? templateData.footer : ""}
                            onChange={handleInputChange}
                            rows="8"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        Save Changes
                    </button>
                </form>
            )}
        </div>
    );
};

export default AdminTemplateEditor;