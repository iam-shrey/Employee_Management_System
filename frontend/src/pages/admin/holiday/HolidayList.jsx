import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import { toast } from 'react-toastify';

const HolidayList = () => {
    const [holidays, setHolidays] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get('/holidays')
            .then(response => {
                setHolidays(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching holidays!', error);
            });
    }, []);

    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this holiday?");
    
        if (confirmed) {
            apiClient.delete(`/holidays/${id}`)
                .then(() => {
                    setHolidays(holidays.filter(holiday => holiday.id !== id));
                    toast.success("Holiday Deleted Successfully!");
                })
                .catch((error) => {
                    console.error('Error deleting holiday', error);
                    toast.error("Error deleting holiday.");
                });
        }
    };    

    const handleEdit = (id) => {
        navigate(`/edit-holiday/${id}`);
    };

    return (
        <div className="p-6 w-3/5 justify-self-center">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">Holiday List</h3>
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                    onClick={() => navigate('/add-holiday')}
                >
                    Add New Holiday
                </button>
            </div>

            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-left">Name</th>
                        <th className="px-4 py-2 border-b text-left">Date</th>
                        <th className="px-4 py-2 border-b text-left">Description</th>
                        <th className="px-4 py-2 border-b text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {holidays.map(holiday => (
                        <tr key={holiday.id} className="border-b hover:bg-gray-100">
                            <td className="px-4 py-2">{holiday.name}</td>
                            <td className="px-4 py-2">{holiday.date}</td>
                            <td className="px-4 py-2">{holiday.description}</td>
                            <td className="px-4 py-2">
                                <button 
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 mr-2"
                                    onClick={() => handleEdit(holiday.id)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
                                    onClick={() => handleDelete(holiday.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HolidayList;