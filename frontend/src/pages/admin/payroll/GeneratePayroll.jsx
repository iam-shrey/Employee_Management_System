import React, { useState } from "react";
import { generatePayroll } from "../../../api/AuthenticationApiService";
import { toast } from "react-toastify";

const GeneratePayroll = () => {
  const [userId, setUserId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payroll = await generatePayroll(userId, year, month);
      setResponse(payroll);
      toast.success("Payroll Generated Successfully!");
    } catch (error) {
      console.error("Error generating payroll:", error);
      toast.error("Error generating payroll");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Generate Payroll</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="flex flex-col">
          <label htmlFor="year" className="text-gray-600">Year:</label>
          <input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="month" className="text-gray-600">Month:</label>
          <input
            id="month"
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Generate Payroll
        </button>
      </form>
      {response && (
        <div className="mt-6 p-4 border border-gray-200 rounded-md">
          <h3 className="text-lg font-medium text-gray-800">Payroll Generated:</h3>
          <pre className="mt-2 text-gray-600">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default GeneratePayroll;