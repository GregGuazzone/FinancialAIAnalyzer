import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-bluegrey-500">
      <h1 className="text-4xl text-gray-200 font-bold mb-6">Welcome to Your Stock Finance Tool</h1>
      <p className="text-lg text-gray-200 mb-8">
        Harnessing the power of AI to provide personalized stock analysis and recommendations.
      </p>
      <Link to="/signup">
        <button className="bg-white-500 hover:bg-blue-800 text-black font-semibold py-2 px-4 rounded">
          Sign Up
        </button>
      </Link>
      <p className="mt-4 text-gray-200 text-sm">
        Already have an account? <Link to="/login" className="text-white">Log in</Link>
      </p>
    </div>
  );
};

export default Home;