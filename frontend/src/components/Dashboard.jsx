import React, { useState, useEffect } from 'react';
import Api from '../Api';
import { useNavigate } from 'react-router-dom'


const Dashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [watchlist, setWatchlist] = useState([]);

  const navigate = useNavigate();


  
  useEffect(() => {
    const checkLoggedIn = async () => {
      const response = await Api.checkLogin();
      setLoggedIn(response);
     };
    

    const getWatchlist = async () => {
      const response = await Api.getWatchlist();
      setWatchlist(response);
    }
    
    checkLoggedIn();
    getWatchlist();

  }, []);

  console.log("Watchlist:", watchlist)

  
  if (!loggedIn) {
    navigate('/');
    return null;
  } else {
    return (
      <div className="flex flex-col items-stretch min-w-screen justify-center h-screen bg-bluegrey-500">
        <h1 className="text-2xl font-bold mb-4 text-white">Dashboard</h1>
        <p className="text-gray-300">Welcome to your dashboard!</p>
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-white">Watchlist</h2>
          <ul>
            {watchlist.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        {/* Add your additional dashboard content here */}
      </div>
    );
  }
};

export default Dashboard;
