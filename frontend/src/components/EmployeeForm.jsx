import React, { useState } from 'react';
import apiClient from '../api/apiClient';

function EmployeeForm({ onEmployeeAdded }) {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    department: '',
    address: '',
    bandLevel: null,
    salary: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    apiClient.post('/employees', employee)
      .then(response => {
        console.log('Employee saved:', response.data);
        setEmployee({ name: '', email: '', department: '', address: '', bandLevel: 0});
        onEmployeeAdded();
      })
      .catch(error => {
        console.error('There was an error saving the employee!', error);
      });
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Add Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={employee.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={employee.email}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={employee.department}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={employee.address}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="bandLevel"
          placeholder="Band Level"  // New field for band level
          value={employee.bandLevel}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={employee.salary}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
