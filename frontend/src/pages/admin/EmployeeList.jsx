import React, { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import { Popover } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../security/AuthContext";
import { Dropdown } from "flowbite-react";
import { HiCog, HiCurrencyDollar, HiLogout, HiUserRemove, HiViewGrid } from "react-icons/hi";
import '../../styles/emplist.css'

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
  const [selectedEmployeeDp, setSelectedEmployeeDp] = useState("");

  const authContext = useAuth();

  const navigate = useNavigate();

  const [emailProcess, setEmailProcess] = useState(false);

  // Fetch Employees
  useEffect(() => {
    fetchEmployees();
    fetchTemplateNames();
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

  const fetchDp = (email) => {
    apiClient.get(`/users/${email}/dp`)
      .then(response => {
        setSelectedEmployeeDp(`data:image/jpeg;base64,${response.data}`);
      })
      .catch(error => {
        setSelectedEmployeeDp("");
        console.error("Error fetching profile picture:", error);
      });
  }

  const generateOfferLetterPreview = () => {
    if (selectedTemplate && selectedEmployee) {
      const url = `/admin/offer-letter/generate?templateId=${selectedTemplate}&id=${selectedEmployee.id}`;
      apiClient
        .get(url)
        .then((response) => {
          if (response.status === 200) {
            const base64Pdf = response.data;
            setPreviewOfferLetter(base64Pdf);
            setIsPreviewModalOpen(true);
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
        .post(url)
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
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTemplate("");
  };

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
    <div className="max-w-6xl mx-auto mt-8 flex-1">
      <h2 className="text-2xl font-bold mb-4">Employee List</h2>
      <div className="max-h-[25rem] overflow-auto border">
        <table className="w-full bg-white border">
          <thead>
            <tr className="w-full bg-gray-200 text-center">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Department</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Offer Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-100 text-center">
                <td className="py-2 px-4 border">{employee.id}</td>
                <td className="py-2 px-4 border">{employee.role}</td>
                <td className="py-2 px-4 border">
                  {employee.firstName + " " + employee.lastName}
                </td>
                <td className="py-2 px-4 border">{employee.email}</td>
                <td className="py-2 px-4 border">{employee.department}</td>
                <td className="py-2 px-4 border">{employee.onboarded ? "Onboarded" : "Pending"}</td>
                <td className="py-2 px-4 border">{employee.offerLetterPdf ? "Sent" : "Pending"}</td>
                <td className="py-2 px-4 border">
                  <Dropdown label="" inline className="">
                    <Dropdown.Header>
                      <span className="block text-sm">{employee.firstName + " " + employee.lastName}</span>
                      <span className="block truncate text-sm font-medium">{employee.email}</span>
                    </Dropdown.Header>
                    <Dropdown.Item icon={HiViewGrid} onMouseEnter={() => fetchDp(employee.email)} className="w-[90%]">
                      <Popover
                        trigger="hover"
                        placement="right"
                        aria-labelledby="profile-popover"
                        className="cursor-default"
                        content={
                          <div className="bg-white p-4 rounded-md shadow-lg w-80">
                            <div className="mb-4 flex justify-center">
                              {selectedEmployeeDp ? (
                                <img
                                  src={selectedEmployeeDp}
                                  alt="Profile Picture"
                                  className="h-24 w-24 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500">No Image</span>
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-gray-700">
                              <p>
                                <strong>Name:</strong> {employee.firstName} {employee.lastName}
                              </p>
                              <p>
                                <strong>Email:</strong> {employee.email}
                              </p>
                              <p>
                                <strong>Department:</strong> {employee.department}
                              </p>
                              <p>
                                <strong>Band Level:</strong> {employee.bandLevel}
                              </p>
                              <p>
                                <strong>Salary:</strong> {employee.salary}
                              </p>
                              <p>
                                <strong>Phone:</strong> {employee.phoneNumber}
                              </p>
                              <p>
                                <strong>Aadhar:</strong> {employee.aadharNumber}
                              </p>
                              <p>
                                <strong>CGPA:</strong> {employee.cgpa}
                              </p>
                              <p>
                                <strong>Graduation Year:</strong> {employee.graduationYear}
                              </p>
                            </div>
                            <div className="mt-4 flex space-x-2 justify-center">
                              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                <Link
                                  to={`/employees/${employee.id}`}
                                  state={{ employee, selectedEmployeeDp }}
                                >Detail
                                </Link>
                              </button>
                            </div>
                          </div>
                        }
                      >
                        <span>Company profile</span>
                      </Popover>
                    </Dropdown.Item>

                    <Dropdown.Item icon={HiCog} className="w-[90%]" onClick={() => { navigate(`/attendance/${employee.id}`, { state: { employee } }) }}>Attendance Record</Dropdown.Item>
                    {employee.onboarded && <Dropdown.Item icon={HiCurrencyDollar} className="w-[90%]" onClick={() => handleSendOfferLetter(employee)}>Send Offer Letter</Dropdown.Item>}
                    <Dropdown.Divider />
                    <Dropdown.Item icon={HiUserRemove} className="w-[90%] text-red-600" onClick={() => {
                      setSelectedEmployee(employee);
                      setConfirmDeleteModalOpen(true);
                    }}>Delete Employee</Dropdown.Item>
                  </Dropdown>
                </td>
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
            <div className="mb-2 flex items-center justify-center">
              {selectedEmployeeDp ? (
                <img
                  src={selectedEmployeeDp}
                  alt="Profile Picture"
                  className="h-[7rem] w-[7rem] rounded-full"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <span className="text-gray-500">No Image Data</span>
                </div>
              )}
            </div>
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
              <Link to={`/employees/${selectedEmployee.id}`} state={{ selectedEmployee, selectedEmployeeDp }} className="text-blue-500"><button
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
