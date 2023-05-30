import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to Your Stock Finance Tool</h1>
      <p className="text-lg text-gray-700 mb-8">
        Harnessing the power of AI to provide personalized stock analysis and recommendations.
      </p>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
        Sign Up
      </button>
      <p className="mt-4 text-gray-600 text-sm">
        Already have an account? <a href="/login" className="text-blue-500">Log in</a>
      </p>
    </div>
  );
};

export default Home;