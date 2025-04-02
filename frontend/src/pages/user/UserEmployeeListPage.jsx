import React, { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

function UserEmployeeListPage() {

  const [employees, setEmployees] = useState([]);

  // Fetch Employees
  useEffect(() => {
    fetchEmployees();
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

  return (
    <div className="w-3/4 mx-auto mt-8 flex-1">
      <h2 className="text-2xl font-bold mb-4">Employee List</h2>
      <div className="max-h-[25rem] overflow-auto border">
        <table className="w-full bg-white border">
          <thead>
            <tr className="w-full bg-gray-200">
              <th className="py-2 px-4 border text-center">Name</th>
              <th className="py-2 px-4 border text-center">Email</th>
              <th className="py-2 px-4 border text-center">Department</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border text-center">
                  {employee.firstName + " " + employee.lastName}
                </td>
                <td className="py-2 px-4 border text-center">{employee.email}</td>
                <td className="py-2 px-4 border text-center">{employee.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserEmployeeListPage;