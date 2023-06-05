import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-bluegrey-500">
      <div className="max-w-md w-full mx-4 bg-white p-6 rounded-md shadow-md">
        <h1 className="text-4xl text-gray-700 font-bold mb-6">Welcome to Your Stock Finance Tool</h1>
        <p className="text-lg text-gray-700 mb-8">
          Harnessing the power of AI to provide personalized stock analysis and recommendations.
        </p>
        <Link to="/signup">
          <button className="bg-bluegrey-300 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded">
            Sign Up
          </button>
        </Link>
        <p className="mt-4 text-gray-700 text-sm">
          Already have an account? <Link to="/login" className="text-blue-300 hover:text-blue-700">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Home;