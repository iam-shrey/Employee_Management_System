import React, { useState } from "react";
import { toast } from "react-toastify";
import apiClient from "../../../api/apiClient";

const ViewPayroll = () => {
  const [userId, setUserId] = useState("");
  const [payrolls, setPayrolls] = useState([]);

  const handleFetch = async () => {
    try {
      const response = await apiClient.get(`/payroll/${userId}`);  // Assuming this API gets payroll data
      setPayrolls(response.data);
    } catch (error) {
      console.error("Error fetching payrolls:", error);
      toast.error("Error fetching payrolls.");
    }
  };

  // Function to download payslip as PDF using Axios
  const downloadPayslip = async (payrollId) => {
    try {
      const response = await apiClient.get(`/payroll/generate-payslip/${payrollId}`, {
        responseType: 'text', 
      });

      if (response.status === 200) {
        const base64String = response.data;
        const byteCharacters = atob(base64String);
        const byteArray = new Uint8Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }

        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        console.error("Error generating payslip");
        toast.error("Error generating payslip.");
      }
    } catch (error) {
      console.error("Error downloading payslip:", error);
      toast.error("Error downloading payslip.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">View Payrolls</h2>
      
      <div className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="userId" className="text-gray-600">User ID:</label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleFetch}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Fetch Payrolls
        </button>
      </div>

      {payrolls.length > 0 && (
        <div className="mt-6 p-4 border border-gray-200 rounded-md">
          <h3 className="text-lg font-medium text-gray-800">Payrolls:</h3>
          <ul className="mt-2 space-y-2">
            {payrolls.map((payroll) => (
              <li key={payroll.id} className="text-gray-700">
                <span className="font-semibold">{payroll.month}:</span> Net Salary - {payroll.netSalary}
                <button
                  onClick={() => downloadPayslip(payroll.id)}
                  className="ml-4 py-1 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Download Payslip
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewPayroll;