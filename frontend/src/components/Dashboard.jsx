import React, { useState, useEffect } from 'react';
import Api from '../Api';
import { useNavigate } from 'react-router-dom'
import '../App.css'


const Dashboard = () => {
  const [watchlist, setWatchlist] = useState([]);

  const navigate = useNavigate();


  
  useEffect(() => {

    const getWatchlist = async () => {
      const response = await Api.getWatchlist();
      setWatchlist(response);
    }
    getWatchlist();

  }, []);

  console.log("Watchlist!:", watchlist)
    return (
      <div className="dashboard-container flex flex-col items-stretch min-w-screen justify-center h-screen bg-bluegrey-500">
        <h1 className="text-2xl font-bold mb-4 text-white">Dashboard</h1>
        <p className="text-gray-300">Welcome to your dashboard!</p>
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-white">Watchlist</h2>
          {watchlist.length > 0 ? (
          <ul>
            {watchlist.map((item, index) => (
              <li className= "text-white" key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className= "text-white">Loading watchlist...</p>
        )}
        </div>
        {/* Add your additional dashboard content here */}
      </div>
    );
};

export default Dashboard;
