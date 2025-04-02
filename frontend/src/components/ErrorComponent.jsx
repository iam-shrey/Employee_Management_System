import { useNavigate } from "react-router-dom";

export default function ErrorComponent() {

    const navigate = useNavigate();

    return (
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-68px)] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        <div className="bg-white rounded-lg p-8 shadow-xl text-center max-w-md w-full">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Oops! Something went wrong.</h1>
          <p className="text-xl text-gray-600 mb-6">
            We are working hard to get this fixed. Please try again later or contact support.
          </p>
          <div className="bg-blue-100 border border-blue-500 text-blue-700 rounded-lg p-4 mb-4">
            <h2 className="font-semibold">404 - Page Not Found</h2>
            <p>Apologies for the inconvenience. You can reach out to our team at:</p>
            <p className="font-bold">ABC-DEF-GHIJ</p>
          </div>
          <button onClick={()=>navigate("/")} className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }
  