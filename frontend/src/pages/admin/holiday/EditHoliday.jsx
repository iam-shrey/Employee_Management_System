import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import { toast } from 'react-toastify';

const EditHoliday = () => {
    const [holiday, setHoliday] = useState({ name: '', date: '', description: '' });
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get(`/holidays/${id}`)
            .then(response => {
                setHoliday(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching holiday data', error);
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHoliday({ ...holiday, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        apiClient.put(`/holidays/${id}`, holiday)
            .then(response => {
                navigate('/holidays');
                toast.success("Holiday Edited Successfully")
            })
            .catch(error => {
                console.error('Error updating holiday', error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 w-3/5 justify-self-center">
            <h2 className="text-2xl font-semibold mb-6">Edit Holiday</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="text-lg font-medium" htmlFor="name">Holiday Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={holiday.name}
                        onChange={handleInputChange}
                        className="p-2 border rounded-lg"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-lg font-medium" htmlFor="date">Holiday Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={holiday.date}
                        onChange={handleInputChange}
                        className="p-2 border rounded-lg"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-lg font-medium" htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={holiday.description}
                        onChange={handleInputChange}
                        className="p-2 border rounded-lg"
                        rows="4"
                    />
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Update Holiday
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

export default EditHoliday;