import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';
import { toast } from 'react-toastify';

const AttendanceSettings = () => {
  const [settings, setSettings] = useState({
    insufficientTimeCutoff: '',
    halfDayCutoff: ''
  });
  const [message, setMessage] = useState('');

  // Fetch the current settings when the page loads
  useEffect(() => {
    apiClient.get('/attendance/admin/settings')
      .then(response => {
        setSettings({
          insufficientTimeCutoff: response.data.insufficientTimeCutoff,
          halfDayCutoff: response.data.halfDayCutoff
        });
      })
      .catch(error => {
        console.error('Error fetching settings:', error);
        setMessage('Error fetching settings');
      });
  }, []);

  // Handle form submission to update settings
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedSettings = {
      insufficientTimeCutoff: parseInt(settings.insufficientTimeCutoff),
      halfDayCutoff: parseInt(settings.halfDayCutoff)
    };

    apiClient.post('/attendance/admin/settings', updatedSettings)
      .then(response => {
        setMessage(response.data);
        toast.success(response.data)
      })
      .catch(error => {
        console.error('Error updating settings:', error);
        setMessage('Error updating settings.');
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Attendance Settings</h1>

      {message && (
        <p className={`text-center text-lg ${message.includes('Error') ? 'text-red-500' : 'text-green-500'} mb-4`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="insufficientTimeCutoff" className="block text-lg font-medium text-gray-700">Insufficient Time Cutoff (hours)</label>
          <input
            type="number"
            id="insufficientTimeCutoff"
            value={settings.insufficientTimeCutoff}
            onChange={(e) => setSettings({ ...settings, insufficientTimeCutoff: e.target.value })}
            className="mt-2 px-4 py-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="halfDayCutoff" className="block text-lg font-medium text-gray-700">Half Day Cutoff (hours)</label>
          <input
            type="number"
            id="halfDayCutoff"
            value={settings.halfDayCutoff}
            onChange={(e) => setSettings({ ...settings, halfDayCutoff: e.target.value })}
            className="mt-2 px-4 py-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="text-center">
          <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceSettings;
