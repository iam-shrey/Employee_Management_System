import React, { useState } from "react";
import { Link } from "react-router-dom";

const NewUserPage = () => {

    return (
        <div className="flex items-center justify-center mt-12">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {name}</h1>
                <p className="text-gray-600 mb-6">
                    We're excited to have you on board. Please complete your onboarding to get started.
                </p>
                <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg p-4 mb-4">
                    <p>Your profile is incomplete. Please complete it to access the system features.</p>
                </div>
                <Link to={'/complete'}>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
                    >
                        Complete Your Profile
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default NewUserPage;
