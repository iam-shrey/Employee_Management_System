import React, { useState } from 'react';
import apiClient from '../../../api/apiClient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddHoliday = () => {
    const [holiday, setHoliday] = useState({
        name: '',
        date: '',
        description: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHoliday(prevHoliday => ({ ...prevHoliday, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        apiClient.post('/holidays', holiday)
            .then(response => {
                toast.success('Holiday added successfully!');
                setHoliday({
                    name: '',
                    date: '',
                    description: ''
                });
                navigate('/holidays');
            })
            .catch(error => {
                toast.error('Holiday already exists for the given date.');
            });
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">Add New Holiday</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="name" className="text-lg font-medium">Holiday Name</label>
                    <input
                        type="text"
                        name="name"
                        value={holiday.name}
                        onChange={handleChange}
                        className="p-3 border rounded-lg"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="date" className="text-lg font-medium">Holiday Date</label>
                    <input
                        type="date"
                        name="date"
                        value={holiday.date}
                        onChange={handleChange}
                        className="p-3 border rounded-lg"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="description" className="text-lg font-medium">Description</label>
                    <textarea
                        name="description"
                        value={holiday.description}
                        onChange={handleChange}
                        className="p-3 border rounded-lg"
                        rows="4"
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <div className="flex justify-between mt-6">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Add Holiday
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/holidays')}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddHoliday;