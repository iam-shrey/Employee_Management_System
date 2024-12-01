import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../security/AuthContext';
import apiClient from '../api/apiClient';
import { useState } from 'react';
import { Button } from 'flowbite-react';

export default function WelcomeComponent() {

    //using path variable name defined above.....
    const username = useAuth().username; //Destructuring the object(key-value pair)

    const name = useAuth().name;

    const navigate = useNavigate();

    const [eloading, setEloading] = useState(false);

    const [dloading, setDloading] = useState(false);

    const [emessage, setEmessage] = useState('');

    const [newUser, setNewUser] = useState(true)

    const [dmessage, setDmessage] = useState('');

    const handleGenerateOfferLetter = async () => {
        setEloading(true);

        await apiClient.post(`/users/emailLetter`)
            .then((response) => {
                setEmessage(response.data)
                setEloading(false);
            }
            )
            .catch(error =>
                setEmessage('Error generating offer letter: ' + error.message)
            )
    };

    const handleDownloadOfferLetter = async () => {
        setDloading(true);
        try {
            const response = await apiClient.get(`/users/offer-letter/download`, {
                responseType: 'blob', // This is crucial for handling binary data
            });

            // Create a new Blob with the response data
            const blob = new Blob([response.data], { type: response.data.type });
            const downloadUrl = URL.createObjectURL(blob);

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'Offer_Letter_' + name + '.pdf'; // Set the file name and extension here

            // Append link to the body and trigger click to start the download
            document.body.appendChild(link);
            link.click();

            // Clean up: remove link and revoke the object URL
            link.remove();
            URL.revokeObjectURL(downloadUrl);

            setDmessage("Offer letter downloaded");
            setDloading(false);
        } catch (error) {
            setDmessage('Error generating offer letter: ' + error.message);
        }
    };

    return (newUser ?

        <div className="flex items-center justify-center mt-12">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {name}</h1>
                <p className="text-gray-600 mb-6">
                    We're excited to have you on board. Please complete your profile to get started.
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



        :


        <div className="WelcomeComponent max-w-lg mx-auto mt-10 p-5 border border-gray-300 rounded-lg shadow-lg bg-white">
            <h1 className="text-3xl font-bold text-center mb-5">Welcome {name}</h1>
            <h1 className="text-3xl font-bold text-center mb-10">Use These Services</h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <Button
                        className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition duration-200 w-full"
                        onClick={handleGenerateOfferLetter}
                        isProcessing={eloading}

                    >
                        Email Offer Letter
                    </Button>
                    {emessage && <div className="text-red-500 mt-2">{emessage}</div>}
                </div>
                <div className="mb-4">
                    <Button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 w-full"
                        onClick={handleDownloadOfferLetter}
                        isProcessing={dloading}
                    >
                        Download Offer Letter
                    </Button>
                    {dmessage && <div className="text-red-500 mt-2">{dmessage}</div>}
                </div>
                <div className="mb-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 w-full"
                        onClick={() => navigate('/fill')}
                    >
                        Fill Your Details
                    </button>
                </div>
                <div className="mb-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 w-full"
                        onClick={() => navigate('/employees')}
                    >
                        Employees
                    </button>
                </div>
                <div className="mb-4 col-span-2">
                    <button
                        className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600 transition duration-200 w-full"
                        onClick={() => navigate('/attendance')}
                    >
                        Mark Attendance
                    </button>
                </div>
            </div>
        </div>

    );
}