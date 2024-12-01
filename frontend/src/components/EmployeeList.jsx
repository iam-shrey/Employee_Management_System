import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewOfferLetter, setPreviewOfferLetter] = useState("");
  const [isConfirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [emailProcess, setEmailProcess] = useState(false);

  const loggedInUser = localStorage.getItem("loggedInUserData");

  let role = null

  if (loggedInUser) {
    const userObject = JSON.parse(loggedInUser);
    role = userObject.userRole;
  } else {
    console.log("No user found");
  }

  // Fetch Employees
  useEffect(() => {
    fetchEmployees();
    fetchTemplateNames(); // Fetch templates when the component mounts
  }, []);

  const fetchEmployees = () => {
    apiClient
      .get("/users")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  };

  const fetchTemplateNames = () => {
    apiClient
      .get("/admin/templates/names")
      .then((response) => {
        setTemplates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching templates:", error);
      });
  };

  const generateOfferLetterPreview = () => {
    if (selectedTemplate && selectedEmployee) {
      const url = `/admin/offer-letter/generate?templateId=${selectedTemplate}&id=${selectedEmployee.id}`;
      apiClient
        .get(url)
        .then((response) => {
          if (response.status === 200) {
            const base64Pdf = response.data; // Base64 encoded string
            setPreviewOfferLetter(base64Pdf); // Set the base64 string to state
            setIsPreviewModalOpen(true); // Show the preview modal
          } else {
            alert("Failed to generate offer letter preview.");
          }
        })
        .catch((error) => {
          console.error("Error generating offer letter preview:", error);
          alert("An error occurred while generating the offer letter preview.");
        });
    } else {
      alert("Please select both a template and an employee.");
    }
  };


  const sendOfferLetter = () => {
    setEmailProcess(true)
    if (selectedTemplate && selectedEmployee) {
      const url = `/admin/offer-letter/send?templateId=${selectedTemplate}&id=${selectedEmployee.id}`;

      apiClient
        .post(url) // Make a POST request with query parameters in the URL
        .then((response) => {
          if (response.status === 200) {
            setEmailProcess(false)
            toast.success(response.data);
            setIsModalOpen(false);
            setIsPreviewModalOpen(false);
          } else {
            toast.error("Failed to send offer letter.");
          }
        })
        .catch((error) => {
          console.error("Error sending offer letter:", error);
          toast.error("An error occurred while sending the offer letter.");
        });
    } else {
      alert("Please select both a template and an employee.");
    }
  };


  const handleSendOfferLetter = (employee) => {
    setSelectedEmployee(employee); // Set the employee for whom the offer letter will be sent
    setIsModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTemplate(""); // Reset selected template
  };

  // Correct the deleteEmployee function
  const deleteEmployee = () => {
    if (selectedEmployee) {
      apiClient
        .delete(`/admin/employees/${selectedEmployee.id}`)
        .then(() => {
          toast.success(`Employee ${selectedEmployee.firstName} ${selectedEmployee.lastName} deleted successfully!`);
          fetchEmployees();
          setConfirmDeleteModalOpen(false);
          setSelectedEmployee(null);
        })
        .catch((error) => {
          console.error("Error deleting employee:", error);
          toast.error("Failed to delete employee.");
        });
    }
  };

  return (
    <div className="w-11/12 mx-auto mt-8 flex-1">
      <h2 className="text-2xl font-bold mb-4">Employee List</h2>
      <div className="max-h-[25rem] overflow-auto border">
        <table className="w-full bg-white border">
          <thead>
            <tr className="w-full bg-gray-200">
              {role == "ADMIN" && <th className="py-2 px-4 border text-center">ID</th>}
              {role == "ADMIN" && <th className="py-2 px-4 border text-center">Role</th>}
              <th className="py-2 px-4 border text-center">Name</th>
              <th className="py-2 px-4 border text-center">Email</th>
              <th className="py-2 px-4 border text-center">Department</th>
              {role == "ADMIN" && <th className="py-2 px-4 border text-center">Status</th>}
              {role == "ADMIN" && <th className="py-2 px-4 border text-center">Offer Status</th>}
              {role == "ADMIN" && <th className="py-2 px-4 border text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-100">
                {role == "ADMIN" && <td className="py-2 px-4 border text-center">{employee.id}</td>}
                {role == "ADMIN" && <td className="py-2 px-4 border text-center">{employee.role}</td>}
                <td className="py-2 px-4 border text-center">
                  {employee.firstName + " " + employee.lastName}
                </td>
                <td className="py-2 px-4 border text-center">{employee.email}</td>
                <td className="py-2 px-4 border text-center">{employee.department}</td>
                {role == "ADMIN" && <td className="py-2 px-4 border text-center">{employee.onboarded ? "Onboarded" : "Pending"}</td>}
                {role == "ADMIN" && <td className="py-2 px-4 border text-center">{employee.offerLetterPdf ? "Sent" : "Pending"}</td>}
                {role == "ADMIN" && <td className="py-2 px-4 border text-center">
                  <button
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setDetailsModalOpen(true);
                    }}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2"
                  >
                    Details
                  </button>
                  {employee.onboarded && <button
                    onClick={() => handleSendOfferLetter(employee)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Send Offer Letter
                  </button>}
                  <button
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setConfirmDeleteModalOpen(true);
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Employee Details</h3>
            <div>
              <p><strong>Name:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
              <p><strong>Email:</strong> {selectedEmployee.email}</p>
              <p><strong>Department:</strong> {selectedEmployee.department}</p>
              <p><strong>Band Level:</strong> {selectedEmployee.bandLevel}</p>
              <p><strong>Salary:</strong> {selectedEmployee.salary}</p>
              <p><strong>Phone Number:</strong> {selectedEmployee.phoneNumber}</p>
              <p><strong>Aadhar Number:</strong> {selectedEmployee.aadharNumber}</p>
              <p><strong>CGPA:</strong> {selectedEmployee.cgpa}</p>
              <p><strong>Graduation Year:</strong> {selectedEmployee.graduationYear}</p>
              <Link to={`/employees/${selectedEmployee.id}`} state={selectedEmployee} className="text-blue-500"><button
                onClick={() => setDetailsModalOpen(false)}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
              >
                See More
              </button></Link> {/* See More Link */}
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {isConfirmDeleteModalOpen && selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the employee{" "}
              <strong>{selectedEmployee.firstName} {selectedEmployee.lastName}</strong>?
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={deleteEmployee}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDeleteModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Letter Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/6 h-full">
            <h3 className="text-xl font-bold mb-4">Preview</h3>
            <div>
              <iframe
                src={`data:application/pdf;base64,${previewOfferLetter}`}
                className="w-full h-[550px]"
                title="Offer Letter Preview"
              />
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Close Preview
                </button>
                <button
                  onClick={sendOfferLetter}
                  isProcessing={emailProcess}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Send Offer Letter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Sending Offer Letter */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Send Offer Letter</h3>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Select Template:</label>
              <select
                className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={selectedTemplate}
                onChange={(event) => setSelectedTemplate(event.target.value)}
              >
                <option value="">Select Template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={generateOfferLetterPreview}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Generate Offer Letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
