import React, { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "../../api/apiClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Label } from "flowbite-react";

const CompleteProfilePage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        email: "",
        password: "",
        address: "",
        pincode: "",
        birthDate: "",
        collegeName: "",
        degree: "",
        graduationYear: "",
        cgpa: "",
        collegeAddress: "",
        aadharNumber: "",
        phoneNumber: "",
        accNumber: "",
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await apiClient.get("/users/current-user");
                setUserId(response.data.id);
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileSizeInMB = file.size / 1024 / 1024;
            const maxSize = 2;

            if (fileSizeInMB > maxSize) {
                toast.error("File size exceeds 2MB.");
                e.target.value = null;
            } else {
                console.log("File is valid:", file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
                setSelectedFile(file);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedFile) {
                const imageData = new FormData();
                imageData.append("file", selectedFile);

                await apiClient.post(`/users/${userId}/upload-dp`, imageData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            const responseProfile = await apiClient.patch("/users/update-profile", formData);
            toast.success(responseProfile.data);
            navigate("/exp");
        }
        catch (error) {
            console.error("Error updating profile:", error.message);
            toast.error("Failed to update profile. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="w-2/3 bg-white shadow-md rounded px-8 py-6 space-y-6"
            >
            <h2 className="text-3xl font-bold text-gray-800">Fill Your Details</h2>

                <div className="flex flex-col items-center">
                    {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Uploaded"
                            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 mb-4"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                            <span className="text-gray-500">No Image Data</span>
                        </div>
                    )}
                    <div>
                        <Label htmlFor="file-upload" value="Choose Your Profile Picture" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="inline border"
                        />
                        {selectedFile && (
                            <button
                                type="button"
                                onClick={() => {
                                        setSelectedFile(null)
                                        setImagePreview(null)
                                        document.getElementById("file-upload").value = ""
                                    }
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">JPG/JPEG (MAX. 2MB)</p>
                </div>

                {/* Personal Details */}
                <fieldset className="border border-gray-300 p-4 rounded">
                    <legend className="text-lg font-semibold text-gray-600">Personal Details</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-gray-700">First Name</span>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                            {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Last Name</span>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                            {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Gender</span>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                className="ml-2 mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && <p className="text-red-500">{errors.gender}</p>}
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Email</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                            {errors.email && <p className="text-red-500">{errors.email}</p>}
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Password</span>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Address</span>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                            {errors.address && <p className="text-red-500">{errors.address}</p>}
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Pincode</span>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                            {errors.pincode && <p className="text-red-500">{errors.pincode}</p>}
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Birth Date</span>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                            {errors.birthDate && <p className="text-red-500">{errors.birthDate}</p>}
                        </label>
                    </div>
                </fieldset>

                {/* College Details */}
                <fieldset className="border border-gray-300 p-4 rounded">
                    <legend className="text-lg font-semibold text-gray-600">College Details</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-gray-700">College Name</span>
                            <input
                                type="text"
                                name="collegeName"
                                value={formData.collegeName}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                            {errors.collegeName && <p className="text-red-500">{errors.collegeName}</p>}
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Degree</span>
                            <input
                                type="text"
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                            {errors.degree && <p className="text-red-500">{errors.degree}</p>}
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Graduation Year</span>
                            <input
                                type="text"
                                name="graduationYear"
                                value={formData.graduationYear}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                            {errors.graduationYear && <p className="text-red-500">{errors.graduationYear}</p>}
                        </label>
                        <label className="block">
                            <span className="text-gray-700">CGPA</span>
                            <input
                                type="text"
                                name="cgpa"
                                value={formData.cgpa}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                            {errors.CGPA && <p className="text-red-500">{errors.CGPA}</p>}
                        </label>
                        <label className="block">
                            <span className="text-gray-700">College Address</span>
                            <input
                                type="text"
                                name="collegeAddress"
                                value={formData.collegeAddress}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                            {errors.collegeAddress && <p className="text-red-500">{errors.collegeAddress}</p>}
                        </label>
                    </div>
                </fieldset>

                {/* Contact Details */}
                <fieldset className="border border-gray-300 p-4 rounded">
                    <legend className="text-lg font-semibold text-gray-600">Contact Details</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-gray-700">Aadhar Number</span>
                            <input
                                type="text"
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                            {errors.aadharNumber && <p className="text-red-500">{errors.aadharNumber}</p>}
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Phone Number</span>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                            {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Account Number</span>
                            <input
                                type="text"
                                name="accNumber"
                                value={formData.accNumber}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500"
                            />
                            {errors.accNumber && <p className="text-red-500">{errors.accNumber}</p>}
                        </label>
                    </div>
                </fieldset>

                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none"
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompleteProfilePage;
