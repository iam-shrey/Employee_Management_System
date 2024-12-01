import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";
import { Label } from "flowbite-react";

function EmployeeEditPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [employee, setEmployee] = useState(location.state?.employee || {});
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(location.state?.imagePreview);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        if (!employee) {
            toast.error("No employee data available.");
            navigate("/employees");
        }
    }, [employee, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prevState => ({
            ...prevState,
            [name]: value,
        }));
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

    const deleteProfilePicture = async () => {
        try {
          const response = await apiClient.delete(`/users/${employee.id}/dp`);
            setSelectedFile(null);
            setImagePreview(null);
            document.getElementById("file-upload").value = "";
            setShowModal(false);
            toast.success(response.data);
        } catch (error) {
          console.error("Error deleting profile picture", error);
          toast.error("An error occurred while deleting the profile picture.");
        }
      };

    const handleSave = async () => {
        setLoading(true);

        const profileDTO = {
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            address: employee.address,
            aadharNumber: employee.aadharNumber,
            phoneNumber: employee.phoneNumber,
            pincode: employee.pincode,
            gender: employee.gender,
            birthDate: employee.birthDate,
            accNumber: employee.accNumber,
            collegeName: employee.collegeName,
            cgpa: employee.cgpa,
            collegeAddress: employee.collegeAddress,
            degree: employee.degree,
            graduationYear: employee.graduationYear,
        };

        if (selectedFile) {
            const imageData = new FormData();
            imageData.append("file", selectedFile);

            await apiClient.post(`/users/${employee.id}/upload-dp`, imageData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        }

        apiClient
            .patch(`/admin/${employee.id}/update-profile`, profileDTO)
            .then(() => {
                toast.success("Employee profile updated successfully");
                navigate(-1);
            })
            .catch(error => {
                toast.error("Error updating employee profile");
                console.error(error);
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="w-2/3 mx-auto mt-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Employee Details</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg justify-center">
                <form>

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
                            <Label htmlFor="file-upload" value="Choose Profile Picture" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="inline border"
                            />
                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={() => setShowModal(true)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">JPG/JPEG (MAX. 2MB)</p>
                    </div>

                    {/* Personal Details */}
                    <fieldset className="border p-4 mb-6">
                        <legend className="text-xl font-semibold">Personal Details</legend>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={employee.firstName || ""}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={employee.lastName || ""}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="gender" className="block text-gray-700">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={employee.gender || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md mt-2 ml-3"
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={employee.email || ""}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="birthDate" className="block text-gray-700">Birth Date</label>
                                <input
                                    type="date"
                                    id="birthDate"
                                    name="birthDate"
                                    value={employee.birthDate || ""}
                                    onChange={handleChange}
                                    placeholder="Birth Date"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="block text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={employee.phoneNumber || ""}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-gray-700">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={employee.address || ""}
                                    onChange={handleChange}
                                    placeholder="Address"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="pincode" className="block text-gray-700">Pincode</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    value={employee.pincode || ""}
                                    onChange={handleChange}
                                    placeholder="Pincode"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* College Details */}
                    <fieldset className="border p-4 mb-6">
                        <legend className="text-xl font-semibold">College Details</legend>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="collegeName" className="block text-gray-700">College Name</label>
                                <input
                                    type="text"
                                    id="collegeName"
                                    name="collegeName"
                                    value={employee.collegeName || ""}
                                    onChange={handleChange}
                                    placeholder="College Name"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="degree" className="block text-gray-700">Degree</label>
                                <input
                                    type="text"
                                    id="degree"
                                    name="degree"
                                    value={employee.degree || ""}
                                    onChange={handleChange}
                                    placeholder="Degree"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="graduationYear" className="block text-gray-700">Graduation Year</label>
                                <input
                                    type="text"
                                    id="graduationYear"
                                    name="graduationYear"
                                    value={employee.graduationYear || ""}
                                    onChange={handleChange}
                                    placeholder="Graduation Year"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="CGPA" className="block text-gray-700">CGPA</label>
                                <input
                                    type="text"
                                    id="CGPA"
                                    name="CGPA"
                                    value={employee.cgpa || ""}
                                    onChange={handleChange}
                                    placeholder="CGPA"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="collegeAddress" className="block text-gray-700">College Address</label>
                                <input
                                    type="text"
                                    id="collegeAddress"
                                    name="collegeAddress"
                                    value={employee.collegeAddress || ""}
                                    onChange={handleChange}
                                    placeholder="College Address"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* Confidential Details */}
                    <fieldset className="border p-4 mb-6">
                        <legend className="text-xl font-semibold">Confidential Details</legend>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="aadharNumber" className="block text-gray-700">Aadhar Number</label>
                                <input
                                    type="text"
                                    id="aadharNumber"
                                    name="aadharNumber"
                                    value={employee.aadharNumber || ""}
                                    onChange={handleChange}
                                    placeholder="Aadhar Number"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="block text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={employee.phoneNumber || ""}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="accNumber" className="block text-gray-700">Account Number</label>
                                <input
                                    type="text"
                                    id="accNumber"
                                    name="accNumber"
                                    value={employee.accNumber || ""}
                                    onChange={handleChange}
                                    placeholder="Account Number"
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* Form Actions */}
                    <div className="mt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-green-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600 transition"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Are you sure you want to remove the image?</h3>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={deleteProfilePicture}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>

    );
}

export default EmployeeEditPage;
