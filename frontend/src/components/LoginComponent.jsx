import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../security/AuthContext';
import { HiInformationCircle } from "react-icons/hi";
import { Alert, Button } from 'flowbite-react';

export default function LoginComponent() {

    const authContext = useAuth()

    const [username, setUsername] = useState(authContext.username || "shreytripti26@gmail.com");

    const [password, setPassword] = useState("");

    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    function handleUsernameChange(event) {
        setUsername(event.target.value)
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };


    async function handleSubmit() {
        setLoading(true);
        try {
            await authContext.login(username, password);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (authContext.role) {
            if (authContext.role === "ADMIN") {
                navigate(`/employees`);
            } else {
                if (authContext.newUser)
                    navigate(`/new`)
                else
                    navigate(`/welcome`);
            }
        }
    }, [authContext]);


    return (
        <div className="Login max-w-md mx-auto mt-10 p-5 border border-gray-300 rounded-lg shadow-lg bg-white">
            <h1 className="text-3xl font-bold text-center mb-4">Time to Login!</h1>
            {showErrorMessage && (
                <Alert color="failure" icon={HiInformationCircle}>
                    <span className="font-medium">Authentication Failed!</span> Please check your credentials.
                </Alert>
            )}
            <div className="LoginForm">
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="username">User Name</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleUsernameChange}
                        onKeyDown={handleKeyDown}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                        id="username"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        onKeyDown={handleKeyDown}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                        id="password"
                    />
                </div>
                <div className="flex justify-between items-center">
                    <Link to="/forgot-password" state={username} className="text-blue-500 hover:underline">Forgot Password?</Link>
                    <Button
                        type="button"
                        name="login"
                        isProcessing={loading}
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Login
                    </Button>
                </div>
            </div>
        </div>

    )
}