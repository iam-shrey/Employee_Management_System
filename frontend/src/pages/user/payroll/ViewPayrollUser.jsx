import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import apiClient from "../../../api/apiClient";
import { useAuth } from "../../../security/AuthContext";

const ViewPayrollUser = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [payrollData, setPayrollData] = useState(null);

  const authContext = useAuth();
  const userId = authContext.userId;

  // Fetch all payrolls for the user
  const fetchPayrolls = async () => {
    try {
      const response = await apiClient.get(`/payroll/${userId}`);
      setPayrolls(response.data);
    } catch (error) {
      console.error("Error fetching payrolls", error);
      toast.error("Error fetching payrolls.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPayrolls();
    }
  }, [userId]);

  // Fetch payroll for a specific month
  const fetchPayrollByMonth = async (month) => {
    try {
      const response = await apiClient.get(`/payroll/${userId}/${month}`);
      setPayrollData(response.data);
    } catch (error) {
      console.error("Error fetching payroll data for the month", error);
      toast.error("Error fetching payroll data for the month.");
    }
  };

  // Handle month change
  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
    fetchPayrollByMonth(month);
  };

  // Function to download payslip as PDF using Base64 string
  const downloadPayslip = async (payrollId) => {
    try {
      const response = await apiClient.get(`/payroll/generate-payslip/${payrollId}`, {
        responseType: 'text',  // Set responseType to text for Base64 encoded string
      });

      if (response.status === 200) {
        const base64String = response.data;  // Get Base64 encoded PDF string
        const byteCharacters = atob(base64String);  // Decode Base64 string into bytes
        const byteArray = new Uint8Array(byteCharacters.length);

        // Convert the decoded string into a byte array
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }

        // Create a Blob object from the byte array
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Create a link to download the Blob
        const link = document.createElement("a");
        link.href = url;
        link.download = `payslip_${payrollId}.pdf`;
        link.click();  // Trigger the download
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

      {/* Display payrolls */}
      {payrolls.length === 0 ? (
        <p>No payroll data available.</p>
      ) : (
        <div>
          <label htmlFor="month" className="text-gray-600">Select Month:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">--Select Month--</option>
            {payrolls.map((payroll) => (
              <option key={payroll.id} value={format(new Date(payroll.month), 'yyyy-MM')}>
                {format(new Date(payroll.month), 'MMMM yyyy')}
              </option>
            ))}
          </select>

          {payrollData && (
            <div className="mt-6 p-4 border border-gray-200 rounded-md">
              <h3 className="text-lg font-medium text-gray-800">Payroll for {format(new Date(payrollData.month), 'MMMM yyyy')}</h3>
              <p><strong>Net Salary:</strong> ₹{payrollData.netSalary}</p>
              <p><strong>Total Working Days:</strong> {payrollData.totalWorkingDays}</p>
              <p><strong>Present Days:</strong> {payrollData.presentDays}</p>
              <p><strong>Leave Days:</strong> {payrollData.leaveDays}</p>
              <p><strong>Absent Days:</strong> {payrollData.absentDays}</p>

              {/* Button to download payslip */}
              <button
                onClick={()=>downloadPayslip(payrollData.id)}
                className="mt-4 py-2 px-4 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Download Payslip
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewPayrollUser;