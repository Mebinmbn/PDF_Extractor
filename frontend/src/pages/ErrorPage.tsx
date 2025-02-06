import React from "react";
import { Link } from "react-router-dom";

const ErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Oops! Something went wrong.
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        We can't seem to find the page you're looking for.
      </p>
      <Link
        to="/"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
