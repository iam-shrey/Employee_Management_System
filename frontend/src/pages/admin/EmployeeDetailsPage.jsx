import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";

function EmployeeDetailPage() {
  const location = useLocation();
  const { employeeId } = useParams();
  const employee = location.state?.employee || {}
  const dp = location.state?.selectedEmployeeDp || {}
  const [experiences, setExperiences] = useState([]);


  useEffect(() => {
    if (employeeId) {
      apiClient
        .get(`/admin/${employeeId}/experiences`)
        .then(response => {
          setExperiences(response.data);
        })
        .catch(error => {
          console.error("Error fetching experiences", error);
        });
    }
  }, [employeeId]);

  if (!employee) {
    return <div>Loading...</div>;
  }

  const handleShowDocument = (document) => {
    if (!document) {
      alert('No document available');
      return;
    }
    try {
      const decodedDocument = atob(document);
      const byteArray = new Uint8Array(decodedDocument.length);

      for (let i = 0; i < decodedDocument.length; i++) {
        byteArray[i] = decodedDocument.charCodeAt(i);
      }

      const blob = new Blob([byteArray], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error('Error opening document:', error);
      toast.error('There was an error opening the document.');
    }
  };

  const navigate = useNavigate();


  return (
    <div className="w-2/3 mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Employee Details</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          {dp ? (
            <img
              src={dp}
              alt="Uploaded"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 mb-4"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <span className="text-gray-500">No Image Data</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p><strong className="text-gray-600">Employee ID:</strong> {employee.id}</p>
            <p><strong className="text-gray-600">Name:</strong> {employee.firstName} {employee.lastName}</p>
            <p><strong className="text-gray-600">Gender:</strong> {employee.gender}</p>
            <p><strong className="text-gray-600">Email:</strong> {employee.email}</p>
            <p><strong className="text-gray-600">Phone Number:</strong> {employee.phoneNumber}</p>
            <p><strong className="text-gray-600">Address:</strong> {employee.address}</p>
            <p><strong className="text-gray-600">Pincode:</strong> {employee.pincode}</p>
            <p><strong className="text-gray-600">Date of Birth:</strong> {employee.birthDate}</p>
            <p><strong className="text-gray-600">College:</strong> {employee.collegeName}</p>
            <p><strong className="text-gray-600">CGPA:</strong> {employee.cgpa}</p>
            <p><strong className="text-gray-600">Band Level:</strong> {employee.bandLevel}</p>
            <p><strong className="text-gray-600">Salary:</strong> ₹{employee.salary}</p>
            <p><strong className="text-gray-600">Join Date:</strong> {employee.joinDate}</p>
            <p><strong className="text-gray-600">Offer Letter:</strong>
              <button onClick={() => handleShowDocument(employee.offerLetterPdf)}
                className="text-blue-500 hover:underline" >See Offer Letter</button></p>
          </div>
          <div>
            <p><strong className="text-gray-600">Designation:</strong> {employee.designation}</p>
            <p><strong className="text-gray-600">Department:</strong> {employee.department}</p>
            <p><strong className="text-gray-600">Graduation Year:</strong> {employee.graduationYear}</p>
            <p><strong className="text-gray-600">College Address:</strong> {employee.collegeAddress}</p>
            <p><strong className="text-gray-600">Aadhar Number:</strong> {employee.aadharNumber}</p>
            <p><strong className="text-gray-600">Account Number:</strong> {employee.accNumber}</p>
          </div>
        </div>

        <h3 className="mt-6 mb-6 font-semibold text-xl text-gray-800">Experience</h3>
        <ul className="space-y-4">
          {experiences.length > 0 ? (
            experiences.map((exp) => (
              <li key={exp.id} className="p-4 border rounded-md shadow-md bg-gray-50">
                <p><strong className="text-gray-600">Company:</strong> {exp.companyName}</p>
                <p><strong className="text-gray-600">Role:</strong> {exp.role}</p>
                <p><strong className="text-gray-600">Duration:</strong> {exp.duration}</p>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => handleShowDocument(exp.experienceLetter)}
                    className="text-blue-500 hover:underline"
                  >
                    Show Experience Letter
                  </button>
                  <button
                    onClick={() => handleShowDocument(exp.offerLetter)}
                    className="text-blue-500 hover:underline"
                    aria-label="View Offer Letter"
                  >
                    Show Offer Letter
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="p-4 border rounded-md shadow-md bg-gray-50">No experience records available.</li>
          )}
        </ul>


        <div className="flex justify-end space-x-2 mt-6">
          <button>
            <Link
              to={-1}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
            >
              Close
            </Link>
          </button>
          <button
            onClick={() => {navigate(`/employees/${employeeId}/edit`, { state: { employee,dp } })}}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetailPage;
