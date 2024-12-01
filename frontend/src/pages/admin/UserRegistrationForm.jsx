import React, { useState } from 'react';
import axios from 'axios';
import apiClient from '../../api/apiClient';
import { toast } from 'react-toastify';

const UserRegistrationForm = () => {
    // State for form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [address, setAddress] = useState('');
    const [designation, setDesignation] = useState(''); // Added designation
    const [joinDate, setJoinDate] = useState(''); // Added joinDate
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate fields
        const newErrors = {};
        if (!firstName) newErrors.firstName = 'First name is required';
        if (!lastName) newErrors.lastName = 'Last name is required';
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
        if (!department) newErrors.department = 'Department is required';
        if (!collegeName) newErrors.collegeName = 'College name is required';
        if (!address) newErrors.address = 'Address is required';
        if (!designation) newErrors.designation = 'Designation is required'; // Validation for designation
        if (!joinDate) newErrors.joinDate = 'Join date is required'; // Validation for joinDate

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setSubmissionMessage('');
            setIsSubmitting(true);

            const user = {
                firstName,
                lastName,
                email,
                department,
                collegeName,
                address,
                designation, // Include designation
                joinDate, // Include joinDate
            };

            try {
                const response = await apiClient.post('/admin/register', user);
                setSubmissionMessage(response.data); // Assuming backend sends success message
                toast.success(response.data)
                // Clear the form fields
                setFirstName('');
                setLastName('');
                setEmail('');
                setDepartment('');
                setCollegeName('');
                setAddress('');
                setDesignation('');
                setJoinDate('');
            } catch (error) {
                setSubmissionMessage('Error: Could not register the user. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-12">
            <h1 className="text-2xl font-bold text-center mb-6">Register User</h1>
            <form onSubmit={handleSubmit}>
                {/* First Name */}
                <div className="mb-4">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div className="mb-4">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Department */}
                <div className="mb-4">
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                    <input
                        type="text"
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                </div>

                {/* College Name */}
                <div className="mb-4">
                    <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700">College Name</label>
                    <input
                        type="text"
                        id="collegeName"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.collegeName && <p className="text-red-500 text-xs mt-1">{errors.collegeName}</p>}
                </div>

                {/* Address */}
                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        rows="3"
                    ></textarea>
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                {/* Designation */}
                <div className="mb-4">
                    <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
                    <input
                        type="text"
                        id="designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
                </div>

                {/* Join Date */}
                <div className="mb-4">
                    <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">Join Date</label>
                    <input
                        type="date"
                        id="joinDate"
                        value={joinDate}
                        onChange={(e) => setJoinDate(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.joinDate && <p className="text-red-500 text-xs mt-1">{errors.joinDate}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                >
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </form>

            {/* Submission Message */}
            {submissionMessage && (
                <div className="mt-4 text-center">
                    <p className={`text-lg ${submissionMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                        {submissionMessage}
                    </p>
                </div>
            )}
        </div>
    );
};

export default UserRegistrationForm;