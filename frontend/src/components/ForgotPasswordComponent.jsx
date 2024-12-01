import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

export default function ForgotPasswordComponent() {

    const location = useLocation();
    
    const [email, setEmail] = useState(location.state);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleEmailSubmit = async () => {
        setLoading(true);
        try {
            await apiClient.post('/auth/forgot-password', { email });
            toast.success("OTP sent successfully!");
            setStep(2);
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data);
            } else {
                toast.error("An unexpected error occurred.");
            }
            console.error("Error sending OTP:", error);
        }
        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if(e.key==="Enter"){
            if (e.target.type=="email") {
                handleEmailSubmit();
            }
            else{
                handleResetPassword();
            }
        }
    };



    const handleResetPassword = async () => {
        setLoading(true);
        try {
            await apiClient.post('/auth/reset-password', { email, otp, newPassword });
            toast.success("Password Reset Successfully!");
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data);
            } else {
                toast.error("An unexpected error occurred.");
            }
            console.error("Error resetting password:", error);
        }
        setLoading(false);
    };

    return (
        <div className="ForgotPassword max-w-md mx-auto mt-10 p-5 border border-gray-300 rounded-lg shadow-lg bg-white">
            <h1 className="text-3xl font-bold text-center mb-4">Forgot Password</h1>
            {step === 1 && (
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                        id="email"
                    />
                    <Button
                        onClick={handleEmailSubmit}
                        isProcessing={loading}
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mt-4 hover:bg-blue-600"
                    >
                        Send OTP
                    </Button>
                </div>
            )}
            {step === 2 && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="otp">OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                            id="otp"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                            id="newPassword"
                        />
                    </div>
                    <Button
                        onClick={handleResetPassword}
                        isProcessing={loading}
                        className="bg-green-500 text-white font-semibold py-2 px-4 rounded mt-4 hover:bg-green-600"
                    >
                        Reset Password
                    </Button>
                </div>
            )}
        </div>
    );
}
