import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[90%] bg-gray-100 px-4">
      <div className="text-center max-w-md">
        <div className="text-[120px] font-bold text-gray-300 leading-none mb-6">
          404
        </div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-base text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-200 transition-all"
          >
            &larr; Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
