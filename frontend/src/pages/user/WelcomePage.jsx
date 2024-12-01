import React from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

function WelcomePage() {

  const handleDownloadOfferLetter = async () => {
    try {
      const response = await apiClient.get(`/users/offer-letter/download`, {
        responseType: 'blob', // This is crucial for handling binary data
      });
  
      // Check if the response data is empty
      if (!response.data || response.data.size === 0) {
        alert("Please ask the admin to update the offer letter!");
        return;
      }
  
      // Create a new Blob with the response data
      const blob = new Blob([response.data], { type: response.data.type });
      const downloadUrl = URL.createObjectURL(blob);
  
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Offer_Letter_' + userObject.firstName + '.pdf'; // Set the file name and extension here
  
      // Append link to the body and trigger click to start the download
      document.body.appendChild(link);
      link.click();
  
      // Clean up: remove link and revoke the object URL
      link.remove();
      URL.revokeObjectURL(downloadUrl);
  
    } catch (error) {
      console.error('Error generating offer letter: ' + error.message);
      alert("An error occurred while downloading the offer letter. Please try again later.");
    }
  };  


  const loggedInUser = localStorage.getItem("loggedInUserData");

  let userObject = null;
  if (loggedInUser) {
    userObject = JSON.parse(loggedInUser);
  } else {
    console.log("No user found");
  }

  const navigate = useNavigate();

  return (
    <div className="relative bg-gray-100 w-4/5 h-[calc(100vh-68px)] justify-self-center">

      {/* Overlay Content */}
      <div className="relative">
        {/* Header */}
        <header className="bg-red-800 text-white  p-4 shadow-md">
          <div className="container mx-auto flex items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-3xl font-bold mb-2">
              Welcome, {userObject?.firstName + " " + userObject?.lastName}!
            </h2>
            <p className="text-gray-700">Designation: {userObject.designation}</p>
            <p className="text-gray-700">Department: {userObject.department}</p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div
              onClick={() => navigate("/attendance")}
              className="cursor-pointer bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition"
            >
              <span className="text-4xl mb-2">🕒</span>
              <span className="text-lg font-semibold text-gray-700">Mark Attendance</span>
            </div>

            <div
              onClick={() => navigate("/view-payslip")}
              className="cursor-pointer bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition"
            >
              <span className="text-4xl mb-2">💰</span>
              <span className="text-lg font-semibold text-gray-700">View Payslip</span>
            </div>

            <div
              onClick={() => navigate("/apply-leave")}
              className="cursor-pointer bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition"
            >
              <span className="text-4xl mb-2">✉️</span>
              <span className="text-lg font-semibold text-gray-700">Apply for Leave</span>
            </div>

            <div
              onClick={() => navigate("/employees")}
              className="cursor-pointer bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition"
            >
              <span className="text-4xl mb-2">📋</span>
              <span className="text-lg font-semibold text-gray-700">View Employees List</span>
            </div>

            <div
              onClick={handleDownloadOfferLetter}
              className="cursor-pointer bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition"
            >
              <span className="text-4xl mb-2">⬇</span>
              <span className="text-lg font-semibold text-gray-700">Download Offer Letter</span>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default WelcomePage;
