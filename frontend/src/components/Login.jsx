import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();


const handleChange = (e) => {
  setFormData((prevFormData) => ({
    ...prevFormData,
    [e.target.name]: e.target.value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const status = await Api.login(formData)
  if(status)  {
    navigate('/dashboard');
    setLoginError('');
  }
  else {
    setLoginError('Invalid email or password');
  }

};

return (
  <div className=" h-screen w-screen bg-bluegrey-500">
    <h2 className="text-2xl font-bold p-4 text-white">Login</h2>
    <div className="">
      <form onSubmit={handleSubmit} className="rounded-md bg-white inline-flex flex-col p-8">
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-lg font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder='email'
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 outline rounded-md placeholder-gray-600 bg-gray-100 text-gray-800 focus:outline-none focus:bg-white"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-lg font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder='password'
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 outline rounded-md placeholder-gray-600 bg-gray-100 text-gray-800 focus:outline-none focus:bg-white"
            required
          />
        </div>

        {loginError && (
          <div className="text-red-500 mb-4">{loginError}</div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 bg-blue-300 rounded-md hover:scale-105 transform transition-all duration-300 ease-in-out"
        >
          Log In
        </button>
        <p className="mt-4 text-gray-600 text-center">
          <a href="/signup" className="text-blue-500 hover:text-blue-700">Don't have an account? Sign Up</a>
        </p>

      </form>
    </div>
  </div>
);
};

export default Login;