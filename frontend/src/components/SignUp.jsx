import React, { useState } from 'react';
import Api from '../Api';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errorMessages, setErrorMessages] = useState({
    username: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, message, error } = await Api.signup(formData);
    console.log(error)
    if (success) {
      navigate('/dashboard');
      // Redirect or show success message
    } else {
      
      console.error(error);
      
    }
  };

  return (
    <div className="h-screen w-screen bg-bluegrey-500">
      <h2 className="text-2xl font-bold text-white p-4">Sign Up</h2>
      <div className="">
        <form onSubmit={handleSubmit} className="rounded-md bg-white inline-flex flex-col p-8">
          <div className="mb-6">
            <label htmlFor="username" className="block mb-2 text-lg font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 outline rounded-md placeholder-gray-600 bg-gray-100 text-gray-800 focus:outline-none focus:bg-white"
              required
            />
            {errorMessages.username && (
              <p className="text-red-500 mt-1">{errorMessages.username}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-lg font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 outline rounded-md placeholder-gray-600 bg-gray-100 text-gray-800 focus:outline-none focus:bg-white"
              required
            />
            {errorMessages.email && (
              <p className="text-red-500 mt-1">{errorMessages.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-lg font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 outline rounded-md placeholder-gray-600 bg-gray-100 text-gray-800 focus:outline-none focus:bg-white"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-300 text-white py-2 rounded hover:scale-105">
            Create Account
          </button>

          <p className="mt-4 text-gray-600 text-center">
            <Link to="/login" className="text-blue-400 hover:text-blue-800">Already have an account? Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;